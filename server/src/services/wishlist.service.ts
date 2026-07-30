import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { AddWishlistInput } from "../validators/wishlist.validator.js";

export const addToWishlist = async (
  userId: string,
  data: AddWishlistInput
) => {
  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
  });

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const exists = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: data.productId,
      },
    },
  });

  if (exists) {
    throw new AppError(
      "Product already exists in wishlist.",
      400
    );
  }

  return prisma.wishlist.create({
    data: {
      userId,
      productId: data.productId,
    },
    include: {
      product: {
        include: {
          category: true,
          images: {
            where: {
              isPrimary: true,
            },
          },
        },
      },
    },
  });
};

export const getWishlist = async (userId: string) => {
  return prisma.wishlist.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: {
          category: true,
          images: {
            where: {
              isPrimary: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const removeFromWishlist = async (
  userId: string,
  productId: string
) => {
  const item = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!item) {
    throw new AppError("Wishlist item not found.", 404);
  }

  await prisma.wishlist.delete({
    where: {
      id: item.id,
    },
  });

  return {
    message: "Removed from wishlist successfully.",
  };
};