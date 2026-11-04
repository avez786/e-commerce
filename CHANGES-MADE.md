# Changes made

- Refreshed shared styling and responsive layouts for product, detail, checkout and orders pages.
- Fixed product-detail Add to Order to use the shared localStorage cart; added quantity checks and persisted cart state.
- Made checkout deterministic and explicitly demo-only (no real payment provider is connected).
- Removed order-status mutation controls from the customer order-history page.
- Added PATCH to gateway CORS methods and configurable frontend origins.
- Added role claims to JWTs; gateway forwards verified user email and role headers.
- Restricted product create/update/delete and order-status changes to ADMIN. Public registration still creates USER accounts.
- Added order-item validation and order-by-ID ownership checks.
- Made database credentials, JWT secret, Eureka URL and frontend API URL configurable.

## Before deployment
1. Set the same strong `JWT_SECRET` for user, gateway, product and order services. Replace the development fallback.
2. Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` for each service as appropriate. The local password fallback is `root123` to match the uploaded project; override it with `DB_PASSWORD` if your MySQL password differs. Never use this fallback for deployment.
3. Do not enter real card details. Checkout is simulated and does not process payment.
4. Stock checking currently is not authoritative server-side; implement backend inventory reservation before real commerce use.
5. Keep product/order services private and expose only the gateway, because downstream identity headers are trusted.
6. Run Maven builds/tests and verify the full flow locally before deployment. These changes have not been verified by a successful full build in this environment.
