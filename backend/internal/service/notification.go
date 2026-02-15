package service

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	webpush "github.com/SherClockHolmes/webpush-go"
	"github.com/nowbind/nowbind/internal/repository"
)

type NotificationService struct {
	notifications *repository.NotificationRepository
	push          *repository.PushRepository
	vapidPublic   string
	vapidPrivate  string
	frontendURL   string
}

func NewNotificationService(
	notifications *repository.NotificationRepository,
	push *repository.PushRepository,
	vapidPublic, vapidPrivate string,
	frontendURL string,
) *NotificationService {
	return &NotificationService{
		notifications: notifications,
		push:          push,
		vapidPublic:   vapidPublic,
		vapidPrivate:  vapidPrivate,
		frontendURL:   frontendURL,
	}
}

func (s *NotificationService) VAPIDPublicKey() string {
	return s.vapidPublic
}

// PushPayload is the JSON sent to the service worker.
type PushPayload struct {
	Title string `json:"title"`
	Body  string `json:"body"`
	URL   string `json:"url"`
}

// SendPush delivers a browser push notification to all of a user's subscribed devices.
func (s *NotificationService) SendPush(ctx context.Context, userID string, payload PushPayload) {
	if s.vapidPublic == "" || s.vapidPrivate == "" {
		return
	}

	subs, err := s.push.GetByUserID(ctx, userID)
	if err != nil || len(subs) == 0 {
		return
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return
	}

	for _, sub := range subs {
		resp, err := webpush.SendNotification(data, &webpush.Subscription{
			Endpoint: sub.Endpoint,
			Keys: webpush.Keys{
				P256dh: sub.P256dh,
				Auth:   sub.Auth,
			},
		}, &webpush.Options{
			VAPIDPublicKey:  s.vapidPublic,
			VAPIDPrivateKey: s.vapidPrivate,
			Subscriber:      s.frontendURL,
		})
		if err != nil {
			log.Printf("push send error for user %s: %v", userID, err)
			continue
		}
		resp.Body.Close()

		// If the push service returns 410 Gone, the subscription is expired — remove it
		if resp.StatusCode == http.StatusGone {
			s.push.DeleteSubscription(ctx, sub.Endpoint, sub.UserID)
		}
	}
}
