// models/AddressModel.ts
import mongoose, { Schema, Document } from "mongoose";
import { IAddress } from "../interfaces/IAddress";

interface IAddressDocument extends IAddress, Document {
    _id: string;
}

const AddressSchema: Schema = new Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
}, {
    timestamps: true,
});

export const AddressModel = mongoose.model<IAddressDocument>("Address", AddressSchema);
