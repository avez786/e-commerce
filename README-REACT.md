# E-commerce Microservices — React Edition

This project keeps the existing Spring Boot microservices and adds a React + Vite storefront in `frontend/`. The older HTML/CSS/JS version is preserved in `frontend-legacy/` as a backup.

## Stack

- React + Vite + React Router
- Spring Boot User, Product and Order services
- Spring Cloud Gateway and Eureka
- MySQL databases
- JWT-based authentication

## Run the React frontend

1. Start MySQL and create the databases expected by each backend service (`user_db`, `product_db`, `order_db`).
2. Set the same strong `JWT_SECRET` environment variable for User, Gateway, Product and Order services. It must be at least 32 bytes for the current HS256 key setup.
3. Start Eureka on `8761`, User on `8081`, Product on `8082`, Order on `8083`, then Gateway on `8080`.
4. Open a terminal in `frontend/` and run:

   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp` if needed.
5. Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Register an account, then browse products.

For Windows, commands to start each Maven service from its own folder are normally `mvnw.cmd spring-boot:run` on Windows or `./mvnw spring-boot:run` on macOS/Linux. Start Eureka first. If Maven dependencies are not already cached, the wrapper needs internet access to download Maven and dependencies.

## Frontend configuration

Copy `frontend/.env.example` to `frontend/.env`. Set `VITE_API_BASE_URL` to the API Gateway URL. Do not point the frontend directly to the Product or Order services.

## Important security and deployment notes

- The `JWT_SECRET` fallback in the current local properties exists only to make local development easier. **Do not use the fallback in a public deployment.** Set a unique, random secret in the hosting provider's secret/environment settings, and use the same value in all four services. Rotate it if it was committed or shared. Changing it invalidates previously issued tokens.
- Database username/password fallbacks are for local development only. Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` separately for each service in the host's environment settings. Never commit real credentials.
- Only the API Gateway should be publicly reachable. Keep Eureka, User, Product and Order service ports private/internal. Product and Order controllers trust identity headers injected by the gateway; exposing those services directly would let a caller forge those headers.
- Set `FRONTEND_ORIGIN` to the exact deployed frontend origin (scheme + hostname + optional port). Avoid wildcard origins when credentials are enabled.
- Checkout is explicitly a **demo** flow. It creates an order in the backend but does not charge a card. Do not collect real payment details without a payment provider integration.
- Inventory is not yet reserved atomically when an order is placed. This is acceptable for a learning demo only; implement server-side stock reservation and rollback before treating this as real commerce.
- `localStorage` is used for the demo JWT and cart. For production, consider a secure HttpOnly cookie-based session design and additional CSRF/XSS protections.

## Frontend features

- Responsive product listing with search and sorting
- Product details and product reviews
- Registration and login
- Persistent local shopping cart
- Demo checkout that creates a backend order
- Customer order history and account page
- User-facing loading and error states

## Validation status

The source changes were reviewed and the JavaScript source was authored for Vite, but a full dependency install/build and end-to-end backend test could not be completed in the current environment. Run `npm install` + `npm run build` in `frontend/`, then build/test each Maven service locally before deploying. Do not consider the application production-ready until the checklist above is addressed.
