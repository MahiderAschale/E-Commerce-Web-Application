import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import prisma from "../config/prisma.js";
import { userSelect } from "../utils/selectors.js";
import { Role } from "@prisma/client";


// create account 
export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: Role.BUYER,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}; 

// login user 
export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  const safeUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: userSelect,
  });

  return {
    token,
    user: safeUser,
  };
};
// profile 
export const getProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect,
  });
};

export const logoutUser = async () => {
  return {
    message: "Logged out successfully",
  };
};