import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "../interfaces/IProduct";

interface IProductDocument extends IProduct, Document {
    _id: string; 
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isAvailable: { type: Boolean, default: true },
});

// Update the updatedAt field on every save
ProductSchema.pre<IProductDocument>("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// Create the Product model
const ProductModel = mongoose.model<IProductDocument>("Product", ProductSchema);

export default ProductModel;
