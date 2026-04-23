import type { ObjectSchema } from "joi";
import BaseDto from "../../../common/dto/baseDto.js";
import Joi from "joi";

class TokenOAuthDto extends BaseDto{
    static schema = Joi.object({
        code: Joi.string().max(10).required(),
        clientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
    })
}

export default TokenOAuthDto