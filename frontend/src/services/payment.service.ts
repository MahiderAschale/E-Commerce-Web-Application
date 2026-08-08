import api from "../api/axios";

/**
 * Initialize Chapa payment
 *
 * The backend creates the Chapa transaction
 * and returns the checkout URL.
 */
export const initializeChapaPayment = async (
  orderId: string
) => {
  const response = await api.post(
    "/payments/chapa/initialize",
    {
      orderId,
    }
  );

  return response.data;
};


/**
 * Get payment status using transaction reference.
 *
 * This is useful if the frontend has tx_ref.
 */
export const getPaymentStatus = async (
  txRef: string
) => {
  const response = await api.get(
    `/payments/chapa/status/${txRef}`
  );

  return response.data;
};

