import { Router } from "express";
import * as oAuthController from "./oAuth.controller.js"
import validate from "../../common/middleware/validate.middleware.js";
import UserInfoOAuthDto from "./Dto/userInfo.dto.js";
import TokenOAuthDto from "./Dto/token.dto.js";
import VerifyCredentialsOAuth from "./Dto/verifyCredentials.dto.js";

const router = Router();

router.get("/", oAuthController.documentDiscovery)
router.get("/auth/:clientId/:state", oAuthController.authorizing)
router.post("/auth/code",validate(VerifyCredentialsOAuth), oAuthController.verifyCredentials)
router.get("/token",validate(TokenOAuthDto), oAuthController.getToken)
router.get("/certs", oAuthController.getPublicKey)
router.get("/user_info",validate(UserInfoOAuthDto), oAuthController.getUserInfo)


export default router