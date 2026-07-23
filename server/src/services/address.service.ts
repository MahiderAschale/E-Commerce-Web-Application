import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import {
  CreateAddressInput,
  UpdateAddressInput,
} from "../validators/address.validator.js";

//create address
export const createAddress = async (
    userId: string,
    data: CreateAddressInput
  ) => {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }
  
    return prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  };

  // get addresses
  export const getAddresses = async (userId: string) => {
    return prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        isDefault: "desc",
      },
    });
  };

//get address
export const getAddress = async (
    userId: string,
    addressId: string
  ) => {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });
  
    if (!address) {
      throw new AppError("Address not found", 404);
    }
  
    return address;
  };

  //update address

  export const updateAddress = async (
    userId: string,
    addressId: string,
    data: UpdateAddressInput
  ) => {
    await getAddress(userId, addressId);
  
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }
  
    return prisma.address.update({
      where: {
        id: addressId,
      },
      data,
    });
  };

  //delete address

  export const deleteAddress = async (
    userId: string,
    addressId: string
  ) => {
    await getAddress(userId, addressId);
  
    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });
  
    return {
      message: "Address deleted successfully",
    };
  };

  //set a default address
  export const setDefaultAddress = async (
    userId: string,
    addressId: string
  ) => {
    await getAddress(userId, addressId);
  
    await prisma.address.updateMany({
      where: {
        userId,
      },
      data: {
        isDefault: false,
      },
    });
  
    return prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        isDefault: true,
      },
    });
  };