import { Router } from "express";
import * as oAuthController from "./oAuth.controller.js"

const router = Router();

router.get("/", oAuthController.documentDiscovery)
router.get("/auth/:clientId/:state", oAuthController.authorizing)
router.post("/auth/code", oAuthController.verifyCredentials)
router.get("/token", oAuthController.getToken)
router.get("/certs", oAuthController.getPublicKey)
router.get("/user_info", oAuthController.getUserInfo)


export default router