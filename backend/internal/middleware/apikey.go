package middleware

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

const ApiKeyUserIDKey contextKey = "api_key_user_id"
const apiKeyIDKey contextKey = "api_key_id"

// statusWriter wraps http.ResponseWriter to capture the status code.
type statusWriter struct {
	http.ResponseWriter
	code int
}

func (w *statusWriter) WriteHeader(code int) {
	w.code = code
	w.ResponseWriter.WriteHeader(code)
}

func ApiKeyAuth(pool *pgxpool.Pool) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			key := extractApiKey(r)
			if key == "" {
				http.Error(w, `{"error":"api key required"}`, http.StatusUnauthorized)
				return
			}

			hash := sha256.Sum256([]byte(key))
			keyHash := hex.EncodeToString(hash[:])

			var userID, keyID string
			err := pool.QueryRow(r.Context(),
				`SELECT id, user_id FROM api_keys WHERE key_hash = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
				keyHash,
			).Scan(&keyID, &userID)

			if err != nil {
				http.Error(w, `{"error":"invalid api key"}`, http.StatusUnauthorized)
				return
			}

			// Update last_used_at
			go func() {
				pool.Exec(context.Background(),
					"UPDATE api_keys SET last_used_at = NOW() WHERE key_hash = $1", keyHash)
			}()

			ctx := context.WithValue(r.Context(), ApiKeyUserIDKey, userID)
			ctx = context.WithValue(ctx, apiKeyIDKey, keyID)

			// Wrap response writer to capture status code
			sw := &statusWriter{ResponseWriter: w, code: http.StatusOK}
			next.ServeHTTP(sw, r.WithContext(ctx))

			// Log usage asynchronously
			ip := r.RemoteAddr
			if fwd := r.Header.Get("X-Real-Ip"); fwd != "" {
				ip = fwd
			}
			go func() {
				pool.Exec(context.Background(),
					`INSERT INTO api_key_usage (api_key_id, endpoint, method, status_code, ip_address, user_agent)
					 VALUES ($1, $2, $3, $4, $5::inet, $6)`,
					keyID, r.URL.Path, r.Method, sw.code, ip, r.Header.Get("User-Agent"),
				)
			}()
		})
	}
}

func extractApiKey(r *http.Request) string {
	if auth := r.Header.Get("Authorization"); auth != "" {
		if strings.HasPrefix(auth, "Bearer nb_") {
			return strings.TrimPrefix(auth, "Bearer ")
		}
	}
	if key := r.URL.Query().Get("api_key"); key != "" {
		return key
	}
	return ""
}
