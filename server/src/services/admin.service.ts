import prisma from "../config/prisma.js";

export const getDashboardStats = async () => {
  const [
    totalProducts,
    totalCategories,
    totalCustomers,
    totalOrders,
    pendingOrders,
    paidOrders,
    revenue,
    recentOrders,
  ] = await Promise.all([
    // Products
    prisma.product.count(),

    // Categories
    prisma.category.count(),

    // Customers
    prisma.user.count({
      where: {
        role: "BUYER",
      },
    }),

    // Orders
    prisma.order.count(),

    // Pending orders
    prisma.order.count({
      where: {
        paymentStatus: "PENDING",
      },
    }),

    // Paid orders
    prisma.order.count({
      where: {
        paymentStatus: "PAID",
      },
    }),

    // Revenue
    prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        paymentStatus: "PAID",
      },
    }),

    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        payment: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    totalProducts,
    totalCategories,
    totalCustomers,
    totalOrders,
    pendingOrders,
    paidOrders,
    revenue: Number(revenue._sum.totalPrice ?? 0),
    recentOrders,
  };
};