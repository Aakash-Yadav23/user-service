const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    otp: { type: String, default:null  },
    otpExpire: { type: Date, default:null  },
});



export const User = mongoose.model("User", userSchema);
