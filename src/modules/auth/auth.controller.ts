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

export const resetPassword = async (req: Request, res: Response) => {
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

export const renewAccessToken = async(req: Request, res: Response) => {
    const refreshToken = req?.cookies.refreshToken;
    const {newAccessToken, newRefreshToken} = await authService.renewAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.ok(res, "Tokens renewed successfully", {accessToken: newAccessToken})
}

export const logout = async(req: Request, res: Response) => {
    const {id} = req.user!;

    await authService.logout(id);

    res.clearCookie("refreshToken");
    ApiResponse.ok(res, "User logged out successfully",);
}


