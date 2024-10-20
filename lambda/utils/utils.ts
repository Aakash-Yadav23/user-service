const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const crypto = require('crypto');
import { CustomError } from '../Error/ErrorHandler';
import { IUser } from '../interfaces/IUser';

let isConnected = false;

export const generateToken = (_id: any, email: string, first_name: string, last_name: string) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
    const expiresIn = process.env.EXPIRES_IN || "24h";
    const token = jwt.sign({ _id, email, first_name, last_name }, JWT_SECRET_KEY, { expiresIn: expiresIn });
    return token;
};
export const verifyToken = async (token: string): Promise<{ decoded: Partial<IUser>; authenticated: boolean }> => {
    try {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

        const decoded = jwt.verify(token, JWT_SECRET_KEY) as unknown as Partial<IUser>;

        console.log("DECODED", decoded._id);
        
        return { decoded, authenticated: decoded._id ? true : false };
    } catch (error) {
        console.error("Token verification failed: ", error);
        return { decoded: {}, authenticated: false }; 
    }
};

export const ValidateDto = (schemaDto: any, body: any) => {

    try {
        const { error, value } = schemaDto.validate(body);
        if (error) {
            throw new CustomError(error, StatusCodes.EXPECTATION_FAILED, "Body Doesnt match with schema")
        };


        return value;

    } catch (error: any) {
        throw new CustomError(error.message || error, StatusCodes.EXPECTATION_FAILED, "Body Doesnt match with schema")
    }


};


export const dbConnect = async () => {
    const MONGO_DB_URL = process.env.MONGO_DB_URL!;

    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(MONGO_DB_URL);
        console.log('MongoDB connected successfully');
        isConnected = true;
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        throw new CustomError(error, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to connect to database");
    }
};



export const SuccessReponse = (statusCode?: number, data?: any, message?: string) => {

    return {
        statusCode: statusCode || 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message || "Success",
            data: data
        }),
    };

};

export const ErrorReponse = (message: string, statusCode?: number, error?: any) => {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message || "Internal server error",
            error: error || "Internal server error"
        }),
    };

};


export const generateOTP = (length = 6) => {
    const otp = crypto.randomInt(0, 10 ** length);
    return String(otp).padStart(length, '0');
}
