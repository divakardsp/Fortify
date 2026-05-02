import type { Request, Response } from "express";
import ApiResponse from "../../common/utils/apiResponse.js";
import * as authService from "./auth.service.js";

interface VerifyParams {
    token: string;
}

export const register = async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    ApiResponse.created(res, "User created successfully", user);
};

export const verifyUser = async (req: Request<VerifyParams>, res: Response) => {
    const { token } = req.params;
    const verifyingUser = await authService.verifyUser(token);

    ApiResponse.no_content(res, "User Verified successfully", verifyingUser);
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const forgotPassRes = await authService.forgotPassword(email);

    ApiResponse.ok(res, "Reset password link sent", forgotPassRes);
};

export const resetPassword = async (req: Request, res: Response) => {   console.log("Password Updated")
    const { resetToken } = req.params as { resetToken: string };
    const { newPassword } = req.body;
    const resData = await authService.resetPassword(newPassword, resetToken);
    ApiResponse.ok(res, "Password Updated", resData);
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
        email,
        password,
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.ok(res, "Login Successful", { user, accessToken });
};

export const renewAccessToken = async (req: Request, res: Response) => {
    const refreshToken = req?.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } =
        await authService.renewAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.ok(res, "Tokens renewed successfully", {
        accessToken: newAccessToken,
    });
};

export const logout = async (req: Request, res: Response) => {
    const { id } = req.user!;

    await authService.logout(id);

    res.clearCookie("refreshToken");
    ApiResponse.ok(res, "User logged out successfully");
};

export const renderResetPasswordPage = async (
    req: Request<VerifyParams>,
    res: Response,
) => {
    const { token } = req.params;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Fortify</title>
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
            --danger-light: #fee2e2;
            --success: #22c55e;
            --success-light: #f0fdf4;
            --radius: 12px;
            --radius-sm: 8px;
            --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html, body {
            width: 100%;
            height: 100%;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'DM Sans', sans-serif;
            background: var(--bg);
            color: var(--text-primary);
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem 1.5rem;
        }

        .background-grid {
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px);
            background-size: 32px 32px;
            pointer-events: none;
            z-index: 0;
        }

        .container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 400px;
        }

        .brand-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 2rem;
            justify-content: center;
        }

        .brand-icon {
            width: 40px;
            height: 40px;
            background: var(--blue);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .brand-icon svg {
            width: 24px;
            height: 24px;
            stroke: #fff;
            fill: none;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .brand-name {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .card {
            background: var(--surface);
            border-radius: 20px;
            border: 1px solid var(--border);
            padding: 36px 40px;
            box-shadow: var(--shadow);
        }

        .heading {
            margin-bottom: 28px;
        }

        .heading h1 {
            font-size: 22px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 4px;
        }

        .heading p {
            font-size: 14px;
            color: var(--text-secondary);
        }

        .field-group {
            display: flex;
            flex-direction: column;
            gap: 14px;
            margin-bottom: 20px;
        }

        .field {
            position: relative;
        }

        .field input {
            width: 100%;
            padding: 13px 16px;
            font-size: 14px;
            font-family: inherit;
            color: var(--text-primary);
            background: var(--surface);
            border: 1.5px solid var(--border);
            border-radius: var(--radius-sm);
            outline: none;
            transition: border-color 0.15s, box-shadow 0.15s;
        }

        .field input::placeholder {
            color: transparent;
        }

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

        .pw-wrap {
            position: relative;
        }

        .pw-wrap input {
            padding-right: 46px;
        }

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
            z-index: 10;
        }

        .toggle-pw:hover {
            color: var(--text-secondary);
        }

        .toggle-pw svg {
            width: 17px;
            height: 17px;
            stroke: currentColor;
            fill: none;
            stroke-width: 1.5;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .password-hint {
            font-size: 12px;
            color: var(--text-muted);
            background: var(--blue-light);
            border: 1px solid var(--blue-mid);
            border-radius: 6px;
            padding: 8px 12px;
            margin: -8px 0 0 0;
        }

        .actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }

        .btn {
            width: 100%;
            padding: 12px 0;
            border-radius: var(--radius-sm);
            font-size: 14px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            border: none;
            transition: all 0.15s ease;
        }

        .btn-primary {
            background: var(--blue);
            color: #fff;
        }

        .btn-primary:hover {
            background: var(--blue-dark);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }

        .btn-primary:active {
            transform: translateY(0);
            box-shadow: none;
        }

        .btn-primary:disabled {
            background: var(--text-muted);
            cursor: not-allowed;
            opacity: 0.6;
        }

        .message-box {
            padding: 14px 16px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            border: 1px solid;
            margin-bottom: 20px;
            display: none;
            animation: slideDown 0.3s ease both;
        }

        .message-box.success {
            background: var(--success-light);
            border-color: var(--success);
            color: #166534;
        }

        .message-box.error {
            background: var(--danger-light);
            border-color: var(--danger);
            color: #7f1d1d;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 480px) {
            .card {
                padding: 28px 24px;
            }

            .heading h1 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="background-grid"></div>
    
    <div class="container">
        <div class="brand-header">
            <div class="brand-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
            </div>
            <span class="brand-name">Fortify</span>
        </div>

        <div class="card">
            <div class="heading">
                <h1>Create new password</h1>
                <p>Enter your new password below</p>
            </div>

            <div class="message-box" id="message"></div>

            <form id="reset-form">
                <div class="field-group">
                    <div class="field pw-wrap">
                        <input 
                            type="password" 
                            id="new-password" 
                            placeholder="New Password" 
                            required
                            autocomplete="new-password"
                        />
                        <label for="new-password">New Password</label>
                        <button type="button" class="toggle-pw" onclick="togglePassword('new-password', this)" aria-label="Show password">
                            <svg viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>

                    <div class="field pw-wrap">
                        <input 
                            type="password" 
                            id="confirm-password" 
                            placeholder="Confirm Password" 
                            required
                            autocomplete="new-password"
                        />
                        <label for="confirm-password">Confirm Password</label>
                        <button type="button" class="toggle-pw" onclick="togglePassword('confirm-password', this)" aria-label="Show password">
                            <svg viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>

                    <div class="password-hint">
                        <small>Password must be at least 8 characters, with 1 uppercase letter and 1 digit</small>
                    </div>
                </div>

                <div class="actions">
                    <button type="submit" class="btn btn-primary">Update Password</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const RESET_TOKEN = "${token}";

        function togglePassword(inputId, button) {
            const input = document.getElementById(inputId);
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            
            button.querySelector('svg').innerHTML = isHidden
                ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>'
                : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
        }

        function isValidPassword(password) {
            return password.length >= 8 && 
                   /(?=.*[A-Z])/.test(password) && 
                   /(?=.*\\d)/.test(password);
        }

        function showMessage(message, type = 'info') {
            const messageBox = document.getElementById('message');
            messageBox.textContent = message;
            messageBox.className = \`message-box \${type}\`;
            messageBox.style.display = 'block';
        }

        function removeErrorClass(inputId) {
            document.getElementById(inputId).classList.remove('error');
        }

        document.getElementById('reset-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const passwordInput = document.getElementById('new-password');
            const confirmInput = document.getElementById('confirm-password');
            const password = passwordInput.value;
            const confirm = confirmInput.value;

            // Validation
            if (!isValidPassword(password)) {
                passwordInput.classList.add('error');
                showMessage('Password must be 8+ characters with 1 uppercase letter and 1 digit', 'error');
                return;
            }

            if (password !== confirm) {
                confirmInput.classList.add('error');
                showMessage('Passwords do not match', 'error');
                return;
            }

            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Updating...';

            try {
                const response = await fetch(\`/api/users/reset-password/\${RESET_TOKEN}\`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newPassword: password })
                });

                const data = await response.json();

                if (!response.ok) {
                    showMessage(data.message || 'Failed to reset password', 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Update Password';
                    return;
                }

                showMessage('Password updated successfully!', 'success');
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);

            } catch (error) {
                console.error('Error:', error);
                showMessage('An error occurred. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = 'Update Password';
            }
        });

        // Remove error class on input
        document.getElementById('new-password').addEventListener('input', () => removeErrorClass('new-password'));
        document.getElementById('confirm-password').addEventListener('input', () => removeErrorClass('confirm-password'));
    </script>
</body>
</html>`;

    return res.send(html);
};
