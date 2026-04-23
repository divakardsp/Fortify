import type { ObjectSchema } from "joi";
import BaseDto from "../../../common/dto/baseDto.js";
import Joi from "joi";

class VerifyCredentialsOAuth extends BaseDto{
    static schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}

export default VerifyCredentialsOAuth