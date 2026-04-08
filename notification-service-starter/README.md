# Notification Service Starter

NestJS notification service built with clean architecture style for a full project. It supports:

- Email via SMTP/Nodemailer
- SMS via Twilio or mock provider
- Push notifications via Firebase Admin SDK or mock provider
- Factory Design Pattern to resolve the correct provider per channel
- PostgreSQL persistence for notification history
- BullMQ + Redis for async delivery jobs
- Swagger documentation
- Unit and integration tests

## Architecture

```txt
src/
  modules/notifications/
    application/
      dto/
      services/
    domain/
      entities/
      enums/
      interfaces/
    infrastructure/
      factories/
      persistence/
      providers/
    presentation/
      controllers/
```

### Why this structure?

- `domain`: the core language of the module
- `application`: use cases and orchestration
- `infrastructure`: providers, DB, queues, external SDKs
- `presentation`: controllers and Swagger-facing DTOs

## Factory Pattern

The `NotificationProviderFactory` decides which implementation should handle the request.

Examples:
- `email` -> `SmtpEmailProvider`
- `sms` -> `TwilioSmsProvider` or `MockSmsProvider`
- `push` -> `FirebasePushProvider` or `MockPushProvider`

That keeps controllers and services clean and avoids if/else chains all over the codebase.

## Main Flow

1. Client calls `POST /api/notifications/send`
2. `SendNotificationService` validates the channel and resolves provider from factory
3. Notification log is stored in PostgreSQL as `pending`
4. Job is added to BullMQ queue
5. Worker picks the job and calls the provider implementation
6. Delivery result is saved as `sent` or `failed`

## Swagger

Swagger UI is available at:

```bash
http://localhost:3000/api/docs
```

## Providers

### Email
Uses Nodemailer SMTP transport via `createTransport()` and `sendMail()`.

### SMS
Uses Twilio for SMS when `SMS_PROVIDER=twilio`; otherwise it falls back to a mock implementation.

### Push Notifications
Uses Firebase Admin SDK when `PUSH_PROVIDER=firebase`; otherwise mock.

## Queues

BullMQ is used for async delivery workers.

## Validation and Testing

- Request payloads are validated using `ValidationPipe` and DTO decorators.
- Tests include unit tests and integration tests using `@nestjs/testing`.

## Run locally

```bash
cp .env.example .env
npm install
npm run migration:run
npm run start:dev
```

## Useful endpoints

```bash
GET  /api/health
POST /api/notifications/send
GET  /api/notifications
GET  /api/docs
```

## Example request

```json
{
  "channel": "email",
  "recipient": "user@example.com",
  "subject": "Welcome",
  "body": "Hello from Notification Service",
  "metadata": {
    "tenantId": "tenant_1"
  },
  "referenceId": "order_123"
}
```

## Next recommended upgrades

- template engine for email/SMS/push
- delivery callbacks/webhooks per provider
- retry policies per channel
- rate limiting per tenant
- per-tenant provider configuration
- audit trail and search filters
- dead-letter queue and alerting
