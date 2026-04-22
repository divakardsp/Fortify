import type BaseDto from "../dto/baseDto.js";
import type { Request, Response, NextFunction, } from "express";
import ApiError from "../utils/apiError.js";



const validate = (DtoClass: typeof BaseDto) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const {errors, value} = DtoClass.validate(req.body)
        if(errors){
            throw ApiError.badRequest(`Error by Joi validation: ${errors}`)
        }
        req.body = value;
        next();
    }
}

export default validate;