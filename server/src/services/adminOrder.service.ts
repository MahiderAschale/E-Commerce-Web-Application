import { OrderStatus } from "@prisma/client";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { UpdateOrderStatusInput } from "../validators/adminOrder.validator.js";

export const getAllOrders = async () => {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        address: true,
        payment: true,
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

  export const getOrder = async (orderId: string) => {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
        address: true,
        payment: true,
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

  export const updateOrderStatus = async (
    orderId: string,
    data: UpdateOrderStatusInput
  ) => {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
  
    if (!order) {
      throw new AppError("Order not found.", 404);
    }
  
    if (order.status === OrderStatus.CANCELLED) {
      throw new AppError(
        "Cancelled orders cannot be updated.",
        400
      );
    }
  
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.CONFIRMED],
      CONFIRMED: [OrderStatus.PROCESSING],
      PROCESSING: [OrderStatus.SHIPPED],
      SHIPPED: [OrderStatus.DELIVERED],
      DELIVERED: [],
      CANCELLED: [],
    };
  
    if (!allowedTransitions[order.status].includes(data.status)) {
      throw new AppError(
        `Cannot change order from ${order.status} to ${data.status}.`,
        400
      );
    }
  
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: data.status,
      },
      include: {
        user: true,
        address: true,
        payment: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  };
  