import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserRoutes } from './routes/auth.routes';
import { CustomError } from './Error/ErrorHandler';



exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        // OWLGO2MN1nGWMIEY
        return await UserRoutes(event);

    } catch (error: any) {
        
        if (error instanceof CustomError) {
            console.error("CustomError: ", error);
            return {
                statusCode: error.statusCode,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: error.message,
                    error: error.details
                }),
            };
        }
        console.error("Error: ", error);

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: error.message,
                error: error.message
            }),
        };
    }
};