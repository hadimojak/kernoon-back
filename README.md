# Kernoon backend

NestJS monorepo for the Kernoon shop. The React app in `C:\Users\day\Documents\kernoon-front` runs on port **5000**. This API is the only public entry, on port **3000**, and it calls the other services over HTTP.

Each app under `apps/` is one process and one Swarm service. Shared code lives in `libs/` and is bundled into the image that imports it.

| App | Port | What it owns |
| --- | --- | --- |
| `api-gateway` | 3000 | Public HTTP, CORS, JWT check, checkout |
| `identity` | 3001 | Signup, customer login, seller login, profile |
| `catalog` | 3002 | Clothes, categories, sizes |
| `cart` | 3003 | Cart lines for a user or a guest cart id |
| `orders` | 3004 | Placed orders, priced from catalog |
| `account` | 3005 | Delivery addresses and saved cards |
| `sellers` | 3006 | Shop applications from `/sell` |

State is in memory so you can run the shop without a database. Keep **one replica** of `identity`, `cart`, `orders`, `account`, and `sellers` until those stores move to Postgres or Redis. A second pod would not see the first pod's data.

## Run on your machine

```bash
npm install
npm run start:dev
```

That starts Postgres, Redis, and RabbitMQ with Docker Compose, then the seven Nest apps on this machine with file watching. The gateway allows `http://localhost:5000`. You need Docker Desktop running. You do not need Swarm for this.

One service at a time:

```bash
npm run start:dev:catalog
```

Local settings are in `.env.development`. Production settings for `www.kernoon.ir` are in `.env.production`.

Demo accounts, password `Password1`:

- Customer: `hadimojak@gmail.com`
- Seller: `seller@kernoon.test`

## HTTP API

Public base URL: `http://localhost:3000/api`

- `POST /api/auth/signup` `{ firstName, lastName, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `POST /api/auth/seller/login` `{ email, password }`
- `GET|PATCH /api/profile` and `PATCH /api/profile/password` with `Authorization: Bearer <token>`
- `GET /api/products?category=newborn&size=0-3`
- `GET /api/products/:id`, `GET /api/categories`, `GET /api/sizes`
- `GET|POST /api/cart/items`, `PATCH|DELETE /api/cart/items/:id`, `DELETE /api/cart`
- `GET /api/orders`, `POST /api/checkout` `{ addressId, paymentMethodId }`
- `GET|POST /api/addresses`, `DELETE /api/addresses/:id`
- `GET|POST /api/payment-methods`, `DELETE /api/payment-methods/:id`
- `POST /api/sellers/applications` `{ shop, name, email, phone, city }`

Guest carts send header `x-cart-id` (8–64 letters, numbers, or dashes). A bearer token attaches the cart to that user. The gateway sets `x-user-id` itself. Do not trust that header from a browser; only the gateway should call the other services.

Cards store brand, holder, expiry, and last four digits. Do not send a full card number.

Password rule, same as the profile page: at least 6 characters, one uppercase letter, and one number.

`GET /health` on every app is the container probe. The gateway report includes each downstream service and stays up when one of them is down (`status: degraded`).

## Containers

Use Compose for infrastructure in development, and Swarm for the whole system in production.

`npm run start:dev` runs `docker compose up` for Postgres (`127.0.0.1:5433`), Redis (`127.0.0.1:6380`), and RabbitMQ (`5672`, management `15672`). Host ports stay off 5432 and 6379 so another local project can keep those. The Nest apps stay on the host so they reload when you save a file. Connection strings in `.env.development` use `127.0.0.1`. Stop the data services with `npm run infra:down`. Data stays in the Compose volumes.

Production is Docker Swarm. Replace every `replace-with-...` value in `.env.production` first. The shop origin is `https://www.kernoon.ir` and `https://kernoon.ir`. The public API is `https://api.kernoon.ir`. Inside the stack, apps reach Postgres, Redis, and RabbitMQ by service name.

```bash
docker swarm init
npm run docker:build:prod
npm run docker:swarm:prod
```

`docker swarm init` is once per machine. `npm run docker:swarm:down` removes the stack.

## Add another service

```bash
nest generate app notifications
```

Give it a port, a `GET /health` route via `HealthModule.forRoot('notifications')`, a build service under the `apps` profile in `docker-compose.yml`, and a service in `deploy/swarm/stack.yml`. Point the gateway at it with a new `*_URL` variable.
