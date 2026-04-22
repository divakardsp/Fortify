import crypto from "crypto"
import jwt from "jsonwebtoken";
import "dotenv/config"

interface GenerateRandomTokensProps{
    rawToken: string,
    hashedToken: string
}

interface PayloadJWTToken{
    id: string,
}

interface PayloadOAuthJWTToken{
    sub: string,
        name: string,
        email: string,
        email_verified: boolean,
        iat: number,
        iss: string,
        aud: string
}
export const generateRandomTokens = () : GenerateRandomTokensProps => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    return {rawToken, hashedToken};
}

export const passwordHashing = (password: string) : string => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export const hashingTokens = (token: string) : string => {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export const generateAccessToken = (payload: PayloadJWTToken | PayloadOAuthJWTToken  ) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || "15m",
    });
}

export const verifyAccessToken = (token: string)  => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)
}

export const generateRefreshToken = (payload: PayloadJWTToken) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || "7d",
    });
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!)
}