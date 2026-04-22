import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";

class LoginDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required(),
    });
}

export default LoginDto
