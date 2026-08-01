import axios from "axios";
import prisma from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const initializeChapaPayment = async (
  userId: string,
  orderId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      user: true,
      payment: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }
  
  if (!order.payment) {
    throw new AppError(
      "Payment record not found for this order.",
      404
    );
  }

  if (order.payment.status === "PAID") {
    throw new AppError("Order is already paid.", 400);
  }

  // Maximum 50 characters
  const tx_ref = `ORD-${order.id.slice(0, 8)}-${Date.now()}`;

  // Save transaction reference
  await prisma.payment.update({
    where: {
      id: order.payment.id,
    },
    data: {
      transactionId: tx_ref,
    },
  });

  const names = order.user.fullName.trim().split(" ");

  const firstName = names[0];

  const lastName =
    names.length > 1 ? names.slice(1).join(" ") : "";

  try {
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: Number(order.totalPrice),

        currency: "ETB",

        email: order.user.email,

        first_name: firstName,

        last_name: lastName,

        tx_ref,

        callback_url: `${env.APP_URL}/api/payments/chapa/verify/${tx_ref}`,

        return_url: `${env.FRONTEND_URL}/payment-success`,

        customization: {
          title: "E-Commerce",
          description: "Order Payment",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );


    return {
      success: true,
      checkoutUrl: response.data.data.checkout_url,
      tx_ref,
    };
  } catch (error: any) {
    console.error(
      "Chapa Error:",
      error.response?.data || error.message
    );

    throw new AppError(
      error.response?.data?.message ||
        "Failed to initialize payment.",
      400
    );
  }
};

export const verifyChapaPayment = async (
  tx_ref: string
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: tx_ref,
    },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const chapaPayment = response.data;

console.log(JSON.stringify(chapaPayment, null, 2));



    if (
      chapaPayment.status === "success" &&
      chapaPayment.data.status === "success"
    ) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: "PAID",
          },
        });

        await tx.order.update({
          where: {
            id: payment.orderId,
          },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },
        });
      });

      
    return chapaPayment;
      
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "FAILED",
      },
    });

    return {
      success: false,
      message: "Payment failed.",
    };
  } catch (error: any) {
    console.error(
      "Verification Error:",
      error.response?.data || error.message
    );

    throw new AppError(
      error.response?.data?.message ||
        "Failed to verify payment.",
      400
    );
  }
};