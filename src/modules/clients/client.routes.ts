import { Router } from "express";
import * as clientController from "./client.controller.js"
import RegisterClientDto from "./Dto/registerClient.dto.js";
import validate from "../../common/middleware/validate.middleware.js";



const router = Router();

router.post("/register", validate(RegisterClientDto)  ,clientController.registerClient);




export default router