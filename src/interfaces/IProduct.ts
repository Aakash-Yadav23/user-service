export interface IProduct {
    _id: string; 
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
    isAvailable: boolean;
}
