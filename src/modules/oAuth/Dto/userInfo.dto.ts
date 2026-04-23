import type { ObjectSchema } from "joi";
import BaseDto from "../../../common/dto/baseDto.js";
import Joi from "joi";

class UserInfoOAuthDto extends BaseDto{
    static schema = Joi.object({
        IDToken: Joi.string().required(),
    })
}

export default UserInfoOAuthDto