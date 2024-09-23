import { CustomError } from "../handlers/CustomError";
import { IAddress } from "../interfaces/IAddress";
import { AddressModel } from "../model/MAddress"; // Make sure to create this model
import httpStatusCode from "http-status-codes";

export class AddressRepository {

    public createAddress = async (addressData: IAddress): Promise<IAddress> => {
        const addressDataToCreate: IAddress = {
            street: addressData.street!,
            city: addressData.city!,
            state: addressData.state!,
            zipCode: addressData.zipCode!,
            country: addressData.country!,
            userId: addressData.userId!
        };

        const createAddress = await AddressModel.create(addressDataToCreate);
        return createAddress;
    }

    public getAddressById = async (id: string): Promise<IAddress | null> => {
        const address = await AddressModel.findById(id);
        if (!address) {
            throw new CustomError("Address Not Found", httpStatusCode.NOT_FOUND);
        }
        return address;
    }

    public getAddressesByUser = async (userId: string): Promise<IAddress[]> => {
        return await AddressModel.find({ userId });
    }

    public updateAddress = async (id: string, addressData: Partial<IAddress>): Promise<IAddress> => {
        const address = await AddressModel.findById(id);
        if (!address) {
            throw new CustomError("Address Not Found", httpStatusCode.NOT_FOUND);
        }

        if (addressData.street) address.street = addressData.street;
        if (addressData.city) address.city = addressData.city;
        if (addressData.state) address.state = addressData.state;
        if (addressData.zipCode) address.zipCode = addressData.zipCode;
        if (addressData.country) address.country = addressData.country;

        await address.save();
        return address;
    }

    public deleteAddress = async (id: string): Promise<boolean> => {
        const address = await AddressModel.findByIdAndDelete(id);
        if (!address) {
            throw new CustomError("Address Not Found", httpStatusCode.NOT_FOUND);
        }
        return true;
    }
}
