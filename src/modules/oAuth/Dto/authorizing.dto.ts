import type { ObjectSchema } from "joi";
import BaseDto from "../../../common/dto/baseDto.js";
import Joi from "joi";

class AuthorizingOAuthDto extends BaseDto{
    static schema = Joi.object({
        clientId: Joi.string().required(),
        state: Joi.string().required(),
    })
}

export default AuthorizingOAuthDto