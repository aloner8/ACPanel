# API App

Current backend stack:

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL

Current API modules:

- auth
- health
- customers
- domains
- packages
- activity logs
- deployments
- backups

Useful commands:

- `npm run dev:api`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run build`

Auth endpoints:

- `POST /api/auth/bootstrap`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/users`
- `POST /api/auth/users`
