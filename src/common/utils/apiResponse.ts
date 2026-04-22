import type { Response } from "express"
class ApiResponse{
    static ok(res: Response, message:string ="ok", data?: any){
        return res.status(200).json({
            success: true,
            message,
            data
        })
    }
    static created(res: Response, message:string ="created", data: any){
        return res.status(201).json({
            success: true,
            message,
            data
        })
    }
    static no_content(res: Response, message:string ="noContent", data: any = null){
        return res.status(204).json({
            success: true,
            message,
            data
        })
    }
}

export default ApiResponse;