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
  
    //  Find product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  
    if (!product) {
      throw new AppError("Product not found", 404);
    }
  
    // Check product status
    if (product.status !== ProductStatus.ACTIVE) {
      throw new AppError("Product is not available", 400);
    }
  
    // 3. Check stock
    if (product.stock < quantity) {
      throw new AppError("Not enough stock available", 400);
    }
  
    // Check if already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  
    //  If already exists → increase quantity
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
  
    // Create new cart item
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


  //get cart items 
  export const getMyCart = async (userId: string) => {
    const cart = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            images: {
              where: {
                isPrimary: true,
              },
            },
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    const subtotal = cart.reduce(
      (total, item) =>
        total + Number(item.product.price) * item.quantity,
      0
    );
  
    return {
      items: cart,
      subtotal,
      totalItems: cart.length,
    };
  };

  //upadte cart items
  export const updateCartItem = async (
    userId: string,
    itemId: string,
    quantity: number
  ) => {
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },
      include: {
        product: true,
      },
    });
  
    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }
  
    if (cartItem.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }
  
    if (quantity > cartItem.product.stock) {
      throw new AppError("Not enough stock available", 400);
    }
  
    return prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });
  };

  //remove cart item

  export const removeCartItem = async (
    userId: string,
    itemId: string
  ) => {
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },
    });
  
    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }
  
    if (cartItem.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }
  
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });
  
    return {
      message: "Item removed from cart",
    };
  };

  //clear cart items 
  export const clearCart = async (userId: string) => {
    await prisma.cartItem.deleteMany({
      where: {
        userId,
      },
    });
  
    return {
      message: "Cart cleared successfully",
    };
  };