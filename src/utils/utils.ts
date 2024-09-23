import { randomInt } from 'crypto';

export const generateOtp = (length: number = 6): { otp: string, otpExpiryDate: string } => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return {
        otp: randomInt(min, max + 1)+"",
        otpExpiryDate:new Date(Date.now() + 15 * 100 * 60).toISOString()

    };
};

