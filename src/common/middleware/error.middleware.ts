import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";

const toOneLine = (message: string) => message.replace(/\s+/g, " ").trim();

const formatErrorMessage = (err: unknown) => {
    if (err instanceof ApiError) {
        return toOneLine(err.message);
    }

    if (err instanceof Error) {
        const message = toOneLine(err.message || "Internal Server Error");

        return message;
    }

    return "Internal Server Error";
};

const errorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        return next(err);
    }

    const message = formatErrorMessage(err);
    const statusCode = err instanceof ApiError ? err.statusCode : 500;

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;
