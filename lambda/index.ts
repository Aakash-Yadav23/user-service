import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserRoutes } from './routes/auth.routes';
import { CustomError } from './Error/ErrorHandler';



exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
        // OWLGO2MN1nGWMIEY
        return await UserRoutes(event);

    } catch (error: any) {
        console.error("Error: ", error.message);

        if (error instanceof CustomError) {
            return {
                statusCode: error.statusCode,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Internal server error",
                    error: error.message
                }),
            };
        }
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Internal server error",
                error: error.message
            }),
        };
    }
};