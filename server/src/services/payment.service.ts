import axios from "axios";
import prisma from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

/**
 * Initialize Chapa payment
 *
 * This:
 * 1. Finds the user's order
 * 2. Checks that the order has a payment
 * 3. Creates a transaction reference
 * 4. Saves the transaction reference
 * 5. Sends the payment request to Chapa
 * 6. Returns Chapa's checkout URL
 */
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
    throw new AppError(
      "This order has already been paid.",
      400
    );
  }

  /*
   * Chapa transaction reference.
   *
   * Keep it short enough for Chapa.
   */
  const txRef = `ORD-${order.id.slice(0, 8)}-${Date.now()}`;

  /*
   * Save transaction reference before
   * sending the request to Chapa.
   */
  await prisma.payment.update({
    where: {
      id: order.payment.id,
    },
    data: {
      transactionId: txRef,
    },
  });

  /*
   * Split user's full name.
   */
  const names = order.user.fullName.trim().split(/\s+/);

  const firstName = names[0] || "Customer";

  const lastName =
    names.length > 1
      ? names.slice(1).join(" ")
      : "Customer";

  try {
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: Number(order.totalPrice),
        currency: "ETB",

        email: order.user.email,

        first_name: firstName,
        last_name: lastName,

        tx_ref: txRef,

        /*
         * Chapa calls this URL after payment.
         *
         * IMPORTANT:
         * APP_URL must be publicly reachable by Chapa.
         */
        callback_url: `${env.APP_URL}/api/payments/chapa/verify/${txRef}`,

        /*
         * After Chapa sends the user back,
         * frontend receives the order ID.
         */
        return_url: `${env.FRONTEND_URL}/payment-success?orderId=${order.id}`,

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

    const checkoutUrl =
      response.data?.data?.checkout_url;

    if (!checkoutUrl) {
      throw new AppError(
        "Chapa did not return a checkout URL.",
        400
      );
    }

    return {
      success: true,
      checkoutUrl,
      tx_ref: txRef,
      orderId: order.id,
    };
  } catch (error: any) {
    console.error(
      "Chapa initialization error:",
      error.response?.data || error.message
    );

    throw new AppError(
      error.response?.data?.message ||
        "Failed to initialize Chapa payment.",
      400
    );
  }
};


/**
 * Verify Chapa payment
 *
 * This endpoint is called by Chapa's callback.
 *
 * It verifies the transaction directly with Chapa
 * and then updates our database.
 */
export const verifyChapaPayment = async (
  txRef: string
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: txRef,
    },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw new AppError(
      "Payment not found.",
      404
    );
  }

  /*
   * If already paid, don't process it again.
   */
  if (payment.status === "PAID") {
    return {
      success: true,
      message: "Payment already verified.",
      paymentStatus: "PAID",
      orderId: payment.orderId,
      tx_ref: txRef,
    };
  }

  try {
    /*
     * Ask Chapa for the real transaction status.
     */
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const chapaPayment = response.data;

    console.log(
      "Chapa verification response:",
      JSON.stringify(chapaPayment, null, 2)
    );

    /*
     * Chapa successful response.
     */
    const isSuccessful =
      chapaPayment?.status === "success" &&
      chapaPayment?.data?.status === "success";

    if (isSuccessful) {
      /*
       * Update payment and order together.
       */
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

      return {
        success: true,
        message: "Payment verified successfully.",
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        orderId: payment.orderId,
        tx_ref: txRef,
      };
    }

    /*
     * Payment was not successful.
     */
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
      message: "Payment was not successful.",
      paymentStatus: "FAILED",
      orderId: payment.orderId,
      tx_ref: txRef,
    };
  } catch (error: any) {
    console.error(
      "Chapa verification error:",
      error.response?.data || error.message
    );

    throw new AppError(
      error.response?.data?.message ||
        "Failed to verify Chapa payment.",
      400
    );
  }
};


/**
 * Get payment status
 *
 * Used by the frontend after Chapa redirects
 * the customer back to our website.
 */
export const getPaymentStatus = async (
  userId: string,
  txRef: string
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      transactionId: txRef,
      order: {
        userId,
      },
    },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw new AppError(
      "Payment not found.",
      404
    );
  }

  return {
    paymentId: payment.id,

    orderId: payment.orderId,

    transactionId: payment.transactionId,

    paymentStatus: payment.status,

    orderStatus: payment.order.status,

    paymentTotal: Number(
      payment.order.totalPrice
    ),
  };
};
