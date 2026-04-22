import type { Request, Response, NextFunction } from "express"
import ApiError from "../../common/utils/apiError.js";
import { verifyAccessToken } from "../../common/utils/jwt.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";


export const authenticate = async (req:Request, res: Response, next: NextFunction ) => {
    let token;

    if(req.headers.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) throw ApiError.unauthorized("Token is missing")

    const decodedToken = verifyAccessToken(token) as {id: string}
    const user = await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.id, decodedToken.id)
    })

    if(!user) throw ApiError.unauthorized("User does not exists")

    req.user = {
        id: user.id
    }

    next()
}