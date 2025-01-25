// for standardizing the responses to the frontend
import {Response} from "express";



export class ResponseHandler {
    public static success<T>(res: Response, statusCode: number, data: T,  message? : string): void {
        res.status(statusCode).json({
            data: data,
            statusCode : statusCode,
            message: message
        });
    }

    public static error<T>(res: Response, statusCode: number = 500, data: T, message: string, ): void {
        res.status(statusCode).json({
            error: {
                statusCode: statusCode,
                message: message,
                data: data
            }
        });
    }
}