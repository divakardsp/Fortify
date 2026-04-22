import ApiError from "../../common/utils/apiError.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import {
    generateAccessToken,
    generateRefreshToken,
    generateRandomTokens,
    hashingTokens,
    passwordHashing,
    verifyRefreshToken,
} from "../../common/utils/jwt.js";
import {
    sendPasswordUpdatedEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
} from "../../common/config/email.js";

interface UserDataProps {
    name: string;
    email: string;
    password: string;
}

export const register = async (userData: UserDataProps) => {
    const { name, email, password } = userData;
    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    const userExists = user.length === 0 ? false : true;
    if (userExists) {
        throw ApiError.conflict("Email already registered");
    }

    const { rawToken, hashedToken } = generateRandomTokens();
    const hashedPassword = passwordHashing(password);

    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    const [newUser] = await db
        .insert(users)
        .values({
            name,
            email,
            password: hashedPassword,
            verificationToken: hashedToken,
            verificationTokenExpires,
        })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
        });

    try {
        await sendVerificationEmail(email, rawToken, name);
    } catch (error) {
        console.log(error);
    }

    return newUser;
};

export const verifyUser = async (token: string) => {
    if (!token) throw ApiError.badRequest("Please provide a token.");

    const hashedToken = hashingTokens(token);

    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.verificationToken, hashedToken),
    });

    if (!user) throw ApiError.unauthorized("Invalid token");

    if (new Date(Date.now()) > user.verificationTokenExpires!)
        throw ApiError.unauthorized("Token expired");

    await db
        .update(users)
        .set({
            isVerified: true,
            verificationToken: null,
            verificationTokenExpires: null,
        })
        .where(eq(users.id, user.id));

    return { isVerified: true };
};

export const forgotPassword = async (email: string) => {
    if (!email) throw ApiError.badRequest("Email is missing");

    const [user] = await db
        .select({
            id: users.id,
            email: users.email,
            name: users.name,
        })
        .from(users)
        .where(eq(users.email, email));

    if (!user)
        throw ApiError.unauthorized("User does not exist with this email");

    const { rawToken, hashedToken } = generateRandomTokens();

    await db
        .update(users)
        .set({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
        })
        .where(eq(users.email, user.email));

    try {
        await sendResetPasswordEmail(email, rawToken, user.name);
    } catch (error) {
        console.log(error);
    }

    return { message: "Reset Password link sent to your mail" };
};

export const resetPassword = async (newPass: string, resetToken: string) => {
    if (!newPass) throw ApiError.badRequest("New password is missing");
    if (!resetToken) throw ApiError.badRequest("Token is missing");

    const hashedResetToken = hashingTokens(resetToken);

    const user = await db.query.users.findFirst({
        where: (users, { eq }) =>
            eq(users.resetPasswordToken, hashedResetToken),
    });

    if (!user) throw ApiError.unauthorized("Invalid Token");
    if (new Date(Date.now()) > user.resetPasswordExpires!)
        throw ApiError.unauthorized("Token expired");

    const newHashedPassword = passwordHashing(newPass);
    await db
        .update(users)
        .set({
            password: newHashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        })
        .where(eq(users.id, user.id));

    try {
        await sendPasswordUpdatedEmail(user.email, user.name);
    } catch (error) {
        console.log(error);
    }

    return { message: "Password updated successfully" };
};

export const login = async (email: string, password: string) => {
    if (!email || !password)
        throw ApiError.badRequest("Email or Password is missing");

    const [user] = await db
        .select({
            id: users.id,
            email: users.email,
            name: users.name,
            password: users.password,
            isVerified: users.isVerified,
        })
        .from(users)
        .where(eq(users.email, email));

    if (!user) throw ApiError.unauthorized("Email or Password is incorrect");

    if (!user?.isVerified)
        throw ApiError.unauthorized("Please verify your email");

    const hashedPassword = passwordHashing(password);
    if (user.password !== hashedPassword)
        throw ApiError.unauthorized("Email or Password is incorrect");

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });
    const hashedRefreshToken = hashingTokens(refreshToken);

    await db
        .update(users)
        .set({
            refreshToken: hashedRefreshToken,
            refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .where(eq(users.id, user.id));

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};

export const renewAccessToken = async (refreshToken: string) => {
    if (!refreshToken) throw ApiError.badRequest("Refresh token is missing");

    const decodedToken = verifyRefreshToken(refreshToken) as { id: string };

    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            refreshToken: users.refreshToken,
            refreshTokenExpires: users.refreshTokenExpires,
        })
        .from(users)
        .where(eq(users.id, decodedToken.id));

    if (!user) throw ApiError.unauthorized("Invalid refresh token");

    const hashedRefreshToken = hashingTokens(refreshToken);

    if (user.refreshToken !== hashedRefreshToken)
        throw ApiError.unauthorized("Invalid refresh token");

    if (
        !user.refreshTokenExpires ||
        new Date(Date.now()) > user.refreshTokenExpires
    ) {
        throw ApiError.unauthorized("Refresh token expired");
    }

    const newAccessToken = generateAccessToken({ id: user.id });
    const newRefreshToken = generateRefreshToken({id: user.id})
    const hashedNewRefreshToken = hashingTokens(newRefreshToken)
    await db
        .update(users)
        .set({
            refreshToken: hashedNewRefreshToken,
            refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        .where(eq(users.id, user.id))

    return { newAccessToken, newRefreshToken };
};

export const logout = async (userId: string) => {
    if(! userId) throw ApiError.badRequest("UserId is missing")
    
    await db
        .update(users)
        .set({
            refreshToken: null,
            refreshTokenExpires: null,
        })
        .where(eq(users.id, userId))
    
    return {message: "User logout successfully"}
}
