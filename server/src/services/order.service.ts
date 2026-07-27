import {
    PaymentMethod,
    ProductStatus,
    Prisma,
  } from "@prisma/client";
  import prisma from "../config/prisma.js";
  import { AppError } from "../utils/AppError.js";
  import { CheckoutInput  ,PlaceOrderInput,} from "../validators/order.validator.js";
  
  const SHIPPING_FEE = new Prisma.Decimal(300);
  
  export const checkout = async (
    userId: string,
    data: CheckoutInput
  ) => {
    const { cartItemIds, addressId, paymentMethod } = data;
  
    // Validate address
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });
  
    if (!address) {
      throw new AppError("Shipping address not found.", 404);
    }
  
    // Get selected cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: {
          in: cartItemIds,
        },
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
    });
  
    if (cartItems.length !== cartItemIds.length) {
      throw new AppError("One or more cart items are invalid.", 400);
    }
  
    let subtotal = new Prisma.Decimal(0);
  
    const items = cartItems.map((item) => {
      if (item.product.status !== ProductStatus.ACTIVE) {
        throw new AppError(
          `${item.product.name} is unavailable.`,
          400
        );
      }
  
      if (item.product.stock < item.quantity) {
        throw new AppError(
          `${item.product.name} only has ${item.product.stock} item(s) left.`,
          400
        );
      }
  
      const lineTotal = item.product.price.mul(item.quantity);
  
      subtotal = subtotal.add(lineTotal);
  
      return {
        cartItemId: item.id,
        productId: item.product.id,
        productName: item.product.name,
        image:
          item.product.images[0]?.imageUrl ?? null,
        quantity: item.quantity,
        unitPrice: Number(item.product.price),
        lineTotal: Number(lineTotal),
      };
    });
  
    const total = subtotal.add(SHIPPING_FEE);
  
    return {
      items,
  
      address,
  
      paymentMethod,
  
      subtotal: Number(subtotal),
  
      shipping: Number(SHIPPING_FEE),
  
      total: Number(total),
    };
  };

  

  export const placeOrder = async (
    userId: string,
    data: PlaceOrderInput
  ) => {
    const summary = await checkout(userId, data);
  
    return prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          addressId: summary.address.id,
          paymentStatus: "PENDING",
          totalPrice: summary.total,
        },
      });
  
      // Create Order Items
      for (const item of summary.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice,
          },
        });
  
        // Reduce Stock
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
  
      // Create Payment
      await tx.payment.create({
        data: {
          orderId: order.id,
          method: data.paymentMethod,
          status: "PENDING",
        },
      });
  
      // Remove purchased cart items
      await tx.cartItem.deleteMany({
        where: {
          id: {
            in: summary.items.map((i) => i.cartItemId),
          },
        },
      });
  
      // Return completed order
      return tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          address: true,
          payment: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  };



  export const getMyOrders = async (userId: string) => {
    return prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        payment: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };


  export const getOrderById = async (
    userId: string,
    orderId: string
  ) => {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        payment: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  
    if (!order) {
      throw new AppError("Order not found.", 404);
    }
  
    return order;
  };



  export const cancelOrder = async (
    userId: string,
    orderId: string
  ) => {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });
  
    if (!order) {
      throw new AppError("Order not found.", 404);
    }
  
    if (order.status !== "PENDING") {
      throw new AppError(
        "Only pending orders can be cancelled.",
        400
      );
    }
  
    return prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
  
      // Update order
      return tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "CANCELLED",
        },
        include: {
          payment: true,
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });
  };