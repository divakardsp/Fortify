import Joi from "joi";
import BaseDto from "../../../common/dto/baseDto.js";

class RegisterClientDto extends BaseDto {
    static schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().lowercase().required(),
        websiteURL: Joi.string().required(),
        redirectURL: Joi.string().required(),
    });
}

export default RegisterClientDto