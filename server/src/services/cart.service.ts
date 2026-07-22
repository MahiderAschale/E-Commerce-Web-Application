import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { AddToCartInput } from "../validators/cart.validator.js";
import { ProductStatus } from "@prisma/client";

//add to cart 
export const addToCart = async (
    userId: string,
    data: AddToCartInput
  ) => {
    const { productId, quantity } = data;
  
    // 1. Find product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  
    if (!product) {
      throw new AppError("Product not found", 404);
    }
  
    // 2. Check product status
    if (product.status !== ProductStatus.ACTIVE) {
      throw new AppError("Product is not available", 400);
    }
  
    // 3. Check stock
    if (product.stock < quantity) {
      throw new AppError("Not enough stock available", 400);
    }
  
    // 4. Check if already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  
    // 5. If already exists → increase quantity
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
  
      if (newQuantity > product.stock) {
        throw new AppError("Requested quantity exceeds available stock", 400);
      }
  
      return prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
        },
      });
    }
  
    // 6. Create new cart item
    return prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  };