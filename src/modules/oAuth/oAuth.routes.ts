import { Router } from "express";
import * as oAuthController from "./oAuth.controller.js"

const router = Router();

router.get("/", oAuthController.documentDiscovery)
router.get("/auth/:clientId/:state", oAuthController.authorizing)
router.post("/auth/code", oAuthController.verifyCredentials)


export default router