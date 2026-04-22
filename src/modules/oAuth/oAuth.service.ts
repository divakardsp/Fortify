import "dotenv/config";
import ApiError from "../../common/utils/apiError.js";
import { db } from "../../db/index.js";
import { clients } from "../../db/schema/clients.js";
import { users } from "../../db/schema/users.js";
import { eq } from "drizzle-orm";
import { passwordHashing } from "../../common/utils/jwt.js";
import { generateCode } from "../../common/utils/code.js";
export const documentDiscovery = async () => {
    const ISSUER = `http://localhost:${process.env.PORT}`;
    const authorization_endpoint = `${ISSUER}/oauth/auth`;
    const token_endpoint = `${ISSUER}/oauth/token`;
    const userinfo_endpoint = `${ISSUER}/oauth/user-info`;
    const jwks_uri = `${ISSUER}/oauth/certs`;
    const response_types_supported = [
        "code",
        "token",
        "id_token",
        "code token",
        "code id_token",
        "token id_token",
        "code token id_token",
        "none",
    ];

    const claims = [
        "aud",
        "email",
        "email_verified",
        "iat",
        "iss",
        "name",
        "sub",
    ];

    return {
        issuer: ISSUER,
        authorization_endpoint,
        token_endpoint,
        userinfo_endpoint,
        jwks_uri,
        response_types_supported,
        claims,
    };
};

export const authorizing = async (clientId: string, state: string) => {
    if (!clientId) throw ApiError.badRequest("Missing clinetId");

    if (!state) throw ApiError.badRequest("Missing state, makes this unsafe.");

    const client = await db.query.clients.findFirst({
        where: eq(clients.id, clientId),
        columns: {
            id: true,
            name: true,
            websiteURL: true,
            redirectURL: true,
        },
    });

    if (!client) throw ApiError.notFound("No client exists for this clientId");

    const ISSUER = `http://localhost:${process.env.PORT}`;
    const authCodeEndpoint = `${ISSUER}/oauth/auth/code?redirectUrl=${encodeURIComponent(client.redirectURL!)}`;
    

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in — Fortify</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --blue: #2563eb;
      --blue-dark: #1d4ed8;
      --blue-light: #eff6ff;
      --blue-mid: #bfdbfe;
      --text-primary: #0f172a;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --border: #e2e8f0;
      --border-focus: #2563eb;
      --surface: #ffffff;
      --bg: #f8fafc;
      --danger: #ef4444;
      --success: #22c55e;
      --radius: 12px;
      --radius-sm: 8px;
      --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    /* subtle grid bg */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
      z-index: 0;
    }

    .wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 400px;
      animation: fadeUp 0.4s ease both;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Card ── */
    .card {
      background: var(--surface);
      border-radius: 20px;
      border: 1px solid var(--border);
      padding: 36px 40px 32px;
      box-shadow: var(--shadow);
    }

    /* ── Fortify brand ── */
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      background: var(--blue);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .brand-icon svg {
      width: 20px;
      height: 20px;
      stroke: #fff;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.4px;
    }

    /* ── Heading ── */
    .heading { margin-bottom: 20px; }

    .heading h1 {
      font-size: 22px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }

    .heading p {
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* ── Client chip ── */
    .client-chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: var(--blue-light);
      border: 1px solid var(--blue-mid);
      border-radius: 100px;
      padding: 4px 12px 4px 5px;
      margin-top: 10px;
    }

    .client-chip-avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--blue);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      color: #fff;
      flex-shrink: 0;
    }

    .client-chip-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--blue-dark);
    }

    .client-chip-url {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'DM Mono', monospace;
      margin-left: 2px;
    }

    /* ── Divider ── */
    .divider {
      height: 1px;
      background: var(--border);
      margin: 24px 0;
    }

    /* ── Fields ── */
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 12px;
    }

    .field {
      position: relative;
    }

    .field input {
      width: 100%;
      padding: 13px 16px;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      color: var(--text-primary);
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .field input::placeholder { color: transparent; }

    .field input:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }

    .field input.error {
      border-color: var(--danger);
      box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
    }

    .field label {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: var(--text-muted);
      pointer-events: none;
      transition: all 0.15s ease;
      background: var(--surface);
      padding: 0 3px;
    }

    .field input:focus + label,
    .field input:not(:placeholder-shown) + label {
      top: 0;
      font-size: 11px;
      font-weight: 500;
      color: var(--blue);
    }

    .field input.error + label {
      color: var(--danger);
    }

    /* password toggle */
    .pw-wrap { position: relative; }
    .pw-wrap input { padding-right: 46px; }

    .toggle-pw {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--text-muted);
      border-radius: 4px;
      transition: color 0.15s;
      display: flex;
      align-items: center;
    }

    .toggle-pw:hover { color: var(--text-secondary); }
    .toggle-pw svg { width: 17px; height: 17px; display: block; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

    /* ── Forgot ── */
    .forgot {
      font-size: 13px;
      color: var(--blue);
      text-decoration: none;
      display: block;
      text-align: right;
      margin-bottom: 22px;
      font-weight: 500;
    }
    .forgot:hover { text-decoration: underline; }

    /* ── Actions ── */
    .actions { display: flex; flex-direction: column; gap: 10px; }

    .btn {
      width: 100%;
      padding: 12px 0;
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      letter-spacing: 0.1px;
    }

    .btn-primary {
      background: var(--blue);
      color: #fff;
    }

    .btn-primary:hover { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
    .btn-primary:active { transform: translateY(0); box-shadow: none; }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1.5px solid var(--border);
    }

    .btn-ghost:hover { background: var(--bg); border-color: #cbd5e1; color: var(--text-primary); }

    /* ── Social divider ── */
    .social-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 4px 0;
    }

    .social-divider::before,
    .social-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .social-divider span {
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
    }

    /* ── Footer ── */
    .card-footer {
      font-size: 12px;
      color: var(--text-muted);
      text-align: center;
      margin-top: 20px;
      line-height: 1.7;
    }

    .card-footer a {
      color: var(--blue);
      text-decoration: none;
      font-weight: 500;
    }

    .card-footer a:hover { text-decoration: underline; }

    /* ── Bottom tagline ── */
    .tagline {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    .tagline svg {
      width: 13px;
      height: 13px;
      stroke: var(--text-muted);
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  </style>
</head>
<body>

<div class="wrapper">
  <div class="card">

    <!-- Fortify brand -->
    <div class="brand">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <span class="brand-name">Fortify</span>
    </div>

    <!-- Heading -->
    <div class="heading">
      <h1>Sign in</h1>
      <p>to continue to</p>
      <div style="margin-top: 10px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div class="client-chip">
          <div class="client-chip-avatar">${client.name.charAt(0).toUpperCase()}</div>
          <span class="client-chip-name">${client.name}</span>
        </div>
        <span class="client-chip-url">${client.websiteURL}</span>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Login form -->
    <form onsubmit="handleSubmit(event)">
      <div class="field-group">
        <div class="field">
          <input type="email" name="email" id="email" placeholder="Email" autocomplete="email" required />
          <label for="email">Email</label>
        </div>

        <div class="field pw-wrap">
          <input type="password" name="password" id="password" placeholder="Password" autocomplete="current-password" required />
          <label for="password">Password</label>
          <button type="button" class="toggle-pw" onclick="togglePw(this)" aria-label="Show password">
            <svg id="eye-icon" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <a class="forgot" href="/forgot-password">Forgot password?</a>

      <div class="actions">
        <button type="submit" class="btn btn-primary">Sign in</button>

        <div class="social-divider"><span>or</span></div>

        <button type="button" class="btn btn-ghost" onclick="window.location.href='/authorize/deny?state=${state}'">
          Cancel
        </button>
      </div>
    </form>

    <div class="card-footer">
      Don't have an account? <a href="/register">Create one</a><br/>
      By continuing, you agree to Fortify's <a href="/terms">Terms</a> &amp; <a href="/privacy">Privacy</a>
    </div>

  </div>

  <div class="tagline">
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Secured by Fortify
  </div>
</div>

<script>
  const AUTH_CODE_ENDPOINT = '${authCodeEndpoint}';

  function togglePw(btn) {
    const input = document.getElementById('password')
    const isHidden = input.type === 'password'
    input.type = isHidden ? 'text' : 'password'
    btn.querySelector('svg').innerHTML = isHidden
      ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
  }

  function handleSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    let valid = true

    // Email validation
    if (!email.value) {
      email.classList.add('error')
      valid = false
    } else if (!email.value.includes('@')) {
      email.classList.add('error')
      valid = false
    } else {
      email.classList.remove('error')
    }

    // Password validation
    if (!password.value) {
      password.classList.add('error')
      valid = false
    } else if (password.value.length < 6) {
      password.classList.add('error')
      valid = false
    } else {
      password.classList.remove('error')
    }

    if (!valid) return

    // Send request to auth code endpoint
    console.log('Sending request to:', AUTH_CODE_ENDPOINT);
    fetch(AUTH_CODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => Promise.reject(data));
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        window.location.href = data.redirectUrl || '/dashboard'
      } else {
        alert(data.message || 'Authentication failed')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert(error.message || 'An error occurred. Please try again.')
    })
  }

  document.getElementById('email').addEventListener('input', function() {
    this.classList.remove('error')
  })
  document.getElementById('password').addEventListener('input', function() {
    this.classList.remove('error')
  })
</script>

</body>
    </html>`;

    return html;
};

export const verifyCredentials = async (email: string, passowrd: string) => {
    if (!email) throw ApiError.badRequest("Email is missing");

    if (!passowrd) throw ApiError.badRequest("Password is missing");

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: {
            id: true,
            email: true,
            name: true,
            password: true,
            isVerified: true,
        },
    });

    if (!user) throw ApiError.unauthorized("Email or Password is incorrect");

    const hashedPass = passwordHashing(passowrd);
    if (user.password !== hashedPass)
        throw ApiError.unauthorized("Email or Password is incorrect");

    if (!user.isVerified) throw ApiError.unauthorized("Email is not verfied");

    const code = generateCode();

    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    await db
        .update(users)
        .set({
            code,
            codeExpires,
        })
        .where(eq(users.id, user.id));

    return code;
};
