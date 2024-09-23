import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import getConfig from "../config/Config";



export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password: string,hashedPassword:string) => {

    return await bcrypt.compare(password,hashedPassword);
};




export const generateToken = (userId: string): string => {
    const secretKey = getConfig().JWT_SECRET;
    const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
    return token;
};




export const verifyToken=(token:string)=>{

    return jwt.verify(token,getConfig().JWT_SECRET) as JwtPayload;

}