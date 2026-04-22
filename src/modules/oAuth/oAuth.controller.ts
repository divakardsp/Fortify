import type { Request, Response } from "express";
import * as oAuthService from "./oAuth.service.js"
import ApiResponse from "../../common/utils/apiResponse.js";

export const documentDiscovery = async (req: Request, res: Response) => {
    const result = await oAuthService.documentDiscovery();
    return ApiResponse.ok(res, "OIDC Endpoints sent" ,result )
}

export const authorizing = async (req: Request, res: Response) => {
    const { clientId, state } = req.params as { clientId: string; state: string };

    const html = await oAuthService.authorizing(clientId, state)

    return res.send(html)
}

export const verifyCredentials = async (req: Request, res: Response) => {
    const {email, password} = req.body 
    const {redirectUrl} = req.query as {redirectUrl: string}
    const code = await oAuthService.verifyCredentials(email, password)

    const url = new URL(redirectUrl);
    url.searchParams.set("code", code)

    console.log(url)
    return ApiResponse.ok(res, `Redirecting to ${url}`, {code} )
}