package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type LoginLogRepository struct {
	pool *pgxpool.Pool
}

func NewLoginLogRepository(pool *pgxpool.Pool) *LoginLogRepository {
	return &LoginLogRepository{pool: pool}
}

func (r *LoginLogRepository) Log(ctx context.Context, userID, ipAddress, userAgent, loginMethod string) {
	_, _ = r.pool.Exec(ctx,
		`INSERT INTO login_logs (user_id, ip_address, user_agent, login_method) VALUES ($1, $2::inet, $3, $4)`,
		userID, ipAddress, userAgent, loginMethod,
	)
}
