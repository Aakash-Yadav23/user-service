import { CustomError } from "../handlers/CustomError";
import { INextfunction, IRequest, IResponse } from "../interfaces/IExpress";



export const globalErrorHandler = (error:Error, req: IRequest, res: IResponse, next: INextfunction) => {

    if(error instanceof CustomError){
        return res.status(error.code).json({
            status: 'error',
            code: error.code,
            message: error.message,
        });
    }

    return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'An unexpected error occurred',
    });


    

}