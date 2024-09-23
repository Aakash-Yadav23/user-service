import { CustomError } from "../handlers/CustomError";
import { IAddress } from "../interfaces/IAddress";
import { createAddressDto } from "../model/dto/Address.dto";
import httpStatusCode from "http-status-codes";
import { AddressRepository } from "../repositories/AddressRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IUser } from "../interfaces/IUser";

export class AddressService {

    private addressRepository = new AddressRepository();

    public CreateAddress = async (addressData: Partial<IAddress>) => {


        const { value, error } = createAddressDto.validate(addressData);

        if (error) {
            throw new CustomError(error.details[0].message, httpStatusCode.EXPECTATION_FAILED)
        };


        const findUser = await new UserRepository().getUserById(value.userId);

        if (!findUser) {
            throw new CustomError("User not found with this mail", httpStatusCode.UNAUTHORIZED);
        }


        const createThisAddress: IAddress = {
            ...value
        }

        console.log("Create This Address",createThisAddress)

        const addressCreated = await this.addressRepository.createAddress(createThisAddress)

        const updateUserAddressIds: Partial<IUser> = {
            addressIds: [...findUser?.addressIds!, addressCreated._id!],
            id: findUser.id
        };

       const updatedUser= await new UserRepository().updateUser(updateUserAddressIds)

       console.log("updatedUser",updatedUser)




        return addressCreated



    }

}