import BaseDto from "../../../common/dto/baseDto.js";
import Joi from "joi";

class RegisterDto extends BaseDto {
    static schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string()
            .min(8)
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .message(
                "Password must contain at least one uppercase letter and one digit",
            )
            .required(),
    });
}

export default RegisterDto;