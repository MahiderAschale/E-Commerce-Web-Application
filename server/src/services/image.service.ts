import { randomUUID } from "crypto";
import prisma from "../config/prisma.js";
import { supabase } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";

export const uploadSingleImage = async (
  productId: string,
  file: Express.Multer.File
) => {
  // Check product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Create unique filename
  const extension = file.originalname.split(".").pop();

  const fileName = `${randomUUID()}.${extension}`;

  // Upload to Supabase
  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new AppError(error.message, 500);
  }

  // Public URL
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  // Is this the first image?
  const count = await prisma.productImage.count({
    where: {
      productId,
    },
  });

  const image = await prisma.productImage.create({
    data: {
      imageUrl: publicUrl,
      productId,
      isPrimary: count === 0,
    },
  });

  return image;
};


// for uploading multiple images

export const uploadMultipleImages = async (
  productId: string,
  files: Express.Multer.File[]
) => {
  // Check product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (!files || files.length === 0) {
    throw new AppError("Please upload at least one image", 400);
  }

  // Does the product already have images?
  const existingImageCount = await prisma.productImage.count({
    where: { productId },
  });

  const images = await Promise.all(
    files.map(async (file, index) => {
      const extension = file.originalname.split(".").pop();

      const fileName = `${randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new AppError(error.message, 500);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      return prisma.productImage.create({
        data: {
          imageUrl: publicUrl,
          productId,
          // Only the very first image of the product becomes primary
          isPrimary: existingImageCount === 0 && index === 0,
        },
      });
    })
  );

  return images;
};

// to get product image 
export const getProductImages = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const images = await prisma.productImage.findMany({
    where: {
      productId,
    },
    orderBy: [
      {
        isPrimary: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return images;
};

// to set primary image 

export const setPrimaryImage = async (imageId: string) => {
  const image = await prisma.productImage.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    throw new AppError("Image not found", 404);
  }

  // Remove primary flag from all images of this product
  await prisma.productImage.updateMany({
    where: {
      productId: image.productId,
    },
    data: {
      isPrimary: false,
    },
  });

  // Set selected image as primary
  const updatedImage = await prisma.productImage.update({
    where: {
      id: imageId,
    },
    data: {
      isPrimary: true,
    },
  });

  return updatedImage;
};

// to delete product image 

export const deleteImage = async (imageId: string) => {
  const image = await prisma.productImage.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new AppError("Image not found", 404);
  }

  // Extract file name from public URL
  const fileName = image.imageUrl.split("/").pop();

  if (!fileName) {
    throw new AppError("Invalid image URL", 500);
  }

  // Delete from Supabase Storage
  const { error } = await supabase.storage
    .from("products")
    .remove([fileName]);

  if (error) {
    throw new AppError(error.message, 500);
  }

  // Delete from database
  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  // If deleted image was primary, assign a new primary image
  if (image.isPrimary) {
    const nextImage = await prisma.productImage.findFirst({
      where: {
        productId: image.productId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (nextImage) {
      await prisma.productImage.update({
        where: {
          id: nextImage.id,
        },
        data: {
          isPrimary: true,
        },
      });
    }
  }

  return {
    message: "Image deleted successfully",
  };
};