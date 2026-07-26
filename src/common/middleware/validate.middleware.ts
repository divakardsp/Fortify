import type BaseDto from "../dto/baseDto.js";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError.js";

const validate = (DtoClass: typeof BaseDto) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { errors, value } = DtoClass.validate(req.body);
        if (errors) {
            const message = Array.isArray(errors)
                ? errors.join(", ")
                : String(errors);
            return next(ApiError.badRequest(message));
        }
        req.body = value;
        next();
    };
};

export default validate;
