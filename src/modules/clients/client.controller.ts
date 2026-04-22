import type { Request,Response } from "express";
import * as clientService from "./client.service.js"
import ApiResponse from "../../common/utils/apiResponse.js";

export const registerClient = async(req: Request, res:Response) => {
    const {name, email, websiteURL, redirectURL } = req.body;
    const result = await clientService.registerClient(req.body);
    return ApiResponse.created(res, "New Client Created", {
        clientId: result?.newClient?.id,
        name: result?.newClient?.name,
        email: result?.newClient?.email,
        websiteURL: result?.newClient?.websiteURL,
        redirectURL: result?.newClient?.redirectURL,
        clientSecret: result?.newClient?.clientSecret
    });
}

