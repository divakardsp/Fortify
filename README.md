# Fortify - OIDC & OAuth2 Authorization Server

A complete, production-ready implementation of OpenID Connect (OIDC) and OAuth2 authorization server built with Express.js, TypeScript, and PostgreSQL. Fortify provides secure user authentication, client management, and token generation for third-party integrations.

##  Features

- **OAuth2 Authorization Code Flow** - Secure authorization code flow implementation
- **OpenID Connect (OIDC)** - Complete OIDC specification compliance
- **User Management** - User registration, email verification, password reset
- **Client Management** - Multi-client support with unique credentials
- **JWT Token Generation** - ID tokens and access tokens with RSA signing
- **Email Verification** - Email-based account verification with time-expiring tokens
- **Password Reset** - Secure password reset via email links
- **OpenID Discovery** - Standard OIDC discovery endpoint (`.well-known/openid-configuration`)
- **Public Key Endpoint** - JWKS (JSON Web Key Set) endpoint for token verification
- **Drizzle ORM** - Type-safe database operations with PostgreSQL
- **Input Validation** - Joi schema validation for all API inputs

##  Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.2
- **Database**: PostgreSQL 17
- **ORM**: Drizzle ORM
- **Authentication**: jsonwebtoken (JWT), Jose (OIDC)
- **Email**: Nodemailer
- **Validation**: Joi
- **Build**: TypeScript Compiler (tsc)

##  Quick Start

### Prerequisites

- Node.js (v18+) or Bun
- PostgreSQL 17
- Docker & Docker Compose
- OpenSSL (for RSA key generation)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd OIDC-OAuth2
```

#### 2. Install Dependencies

```bash
npm install
# or with bun
bun install
```

#### 3. Generate RSA Keys

This step creates the cryptographic keys needed for JWT signing:

```bash
npm run keys
# or
bun run keys
```

This creates:

- `cert/private-key.pem` - Private key for signing tokens
- `cert/public-key.pub` - Public key for verification

#### 4. Start PostgreSQL

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432` with:

- User: `postgres`
- Password: `postgres123`
- Database: `divakarDB`

#### 5. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server
PORT=5473
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/divakarDB

# JWT Configuration
ACCESS_TOKEN_SECRET=your-secret-key-here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret-key
REFRESH_TOKEN_EXPIRES_IN=7d

# OAuth2 / OIDC
ISSUER=http://localhost:5473

# Email Configuration (for password reset & verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@fortify.local
```

#### 6. Generate & Migrate Database

```bash
# Generate Drizzle migrations
npm run generate

# Apply migrations to database
npm run migrate
```

#### 7. Start Development Server

```bash
npm run dev
# or with bun
bun run dev
```

Server will be running on `http://localhost:5473`

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/                    # User authentication & management
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.middleware.ts
│   │   └── Dto/
│   ├── oAuth/                   # OAuth2 & OIDC implementation
│   │   ├── oAuth.controller.ts
│   │   ├── oAuth.service.ts
│   │   └── oAuth.routes.ts
│   └── clients/                 # OAuth2 client management
│       ├── client.controller.ts
│       ├── client.service.ts
│       ├── client.routes.ts
│       └── Dto/
├── common/
│   ├── config/
│   │   └── email.ts            # Email service configuration
│   ├── dto/
│   │   └── baseDto.ts          # Base DTO class
│   ├── middleware/
│   │   └── validate.middleware.ts  # Input validation
│   └── utils/
│       ├── jwt.ts              # JWT token generation & verification
│       ├── apiError.ts         # Error handling
│       ├── apiResponse.ts      # Response formatting
│       └── code.ts             # Authorization code generation
├── db/
│   ├── index.ts                # Database connection
│   └── schema/
│       ├── users.ts            # User table schema
│       └── clients.ts          # OAuth clients table schema
├── types/
│   └── express.d.ts            # Express type extensions
├── app.ts                       # Express app setup
└── index.ts                     # Server entry point
```

##  Database Schema

### Users Table

```
- id (UUID, Primary Key)
- name (String)
- email (String, Unique)
- password (Hashed)
- isVerified (Boolean)
- code (String) - Authorization code
- codeExpires (Timestamp) - Code expiration
- verificationToken (String)
- verificationTokenExpires (Timestamp)
- refreshToken (String)
- refreshTokenExpires (Timestamp)
- resetPasswordToken (String)
- resetPasswordExpires (Timestamp)
```

### Clients Table

```
- id (UUID, Primary Key)
- name (String, Unique)
- email (String, Unique)
- websiteURL (String, Unique)
- redirectURL (String, Unique) - OAuth callback URL
- clientSecret (String, Unique)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

##  API Endpoints

### Authentication (`/api/users`)

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| POST   | `/register`                   | Register new user       |
| POST   | `/verify-email/:token`        | Verify email with token |
| POST   | `/login`                      | Login user              |
| POST   | `/logout`                     | Logout (requires auth)  |
| POST   | `/forgot-password`            | Request password reset  |
| PUT    | `/reset-password/:resetToken` | Reset password          |

### OAuth2/OIDC (`/oauth`)

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/`                      | OIDC Discovery document |
| GET    | `/auth/:clientId/:state` | Authorization page      |
| POST   | `/auth/code`             | Authenticate & get code |
| GET    | `/token`                 | Token exchange endpoint |
| GET    | `/certs`                 | Public key (JWKS)       |

### Client Management (`/api/clients`)

| Method | Endpoint    | Description            |
| ------ | ----------- | ---------------------- |
| POST   | `/register` | Register OAuth2 client |

### OIDC Discovery (`/.well-known/openid-configuration`)

| Method | Endpoint | Description          |
| ------ | -------- | -------------------- |
| GET    | `/`      | OpenID Configuration |

##  OAuth2 Flow Example

```
1. Client redirects user to:
   http://localhost:5473/oauth/auth/{clientId}/{state}

2. User sees login page & submits credentials

3. Server responds with authorization code

4. Client exchanges code for ID token:
   POST /oauth/token
   {
     "code": "...",
     "clientId": "...",
     "clientSecret": "..."
   }

5. Client receives ID token with user info:
   {
     "sub": "user-id",
     "name": "User Name",
     "email": "user@example.com",
     "email_verified": true,
     "iat": 1234567890,
     "exp": 1234571490,
     "iss": "http://localhost:5473",
     "aud": "client-id"
   }
```

##  Available NPM Scripts

```bash
npm run start          # Production: Run compiled app
npm run build          # Compile TypeScript to JavaScript
npm run dev            # Development: Watch & auto-reload (tsc-watch)
npm run bunDev         # Development: Watch with Bun runtime
npm run generate       # Generate Drizzle migrations from schema
npm run migrate        # Apply pending migrations to database
npm run push           # Push schema to database (Drizzle)
npm run studio         # Open Drizzle Studio (GUI)
npm run keys           # Generate RSA key pair for JWT signing
```

##  Security Features

- ✅ RSA-signed JWT tokens
- ✅ Email verification tokens
- ✅ Secure refresh token rotation
- ✅ Authorization code expiration
- ✅ CORS-ready (can be configured)
- ✅ Input validation on all endpoints
- ✅ Unique client secrets per OAuth application

##  Development Tips

### View Database with Drizzle Studio

```bash
npm run studio
```

Opens a GUI at `http://localhost:5173` to browse & edit database

### Hot Reload Development

```bash
npm run dev
# or
npm run bunDev
```

Changes to TypeScript files automatically recompile and restart server

### Check Compiled Output

The compiled JavaScript is in `dist/` directory. You can inspect it for debugging or deployment.

##  Email Configuration

For password reset and email verification emails to work:

1. Get an [app password](https://myaccount.google.com/apppasswords) from Gmail
2. Update `.env`:
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASSWORD=your-app-password
    ```

##  Example Client Registration

```bash
curl -X POST http://localhost:5473/api/clients/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "email": "app@example.com",
    "websiteURL": "https://myapp.com",
    "redirectURL": "https://myapp.com/callback"
  }'
```

Response includes `clientSecret` - store this securely!

**Built with ❤️ for secure authentication**
