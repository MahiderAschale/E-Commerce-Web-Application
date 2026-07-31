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



interface UpdateProfileInput {
  fullName?: string;
  email?: string;
  phone?: string;
}

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // Check email uniqueness
  if (data.email && data.email !== user.email) {
    const emailExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailExists) {
      throw new AppError("Email is already in use.", 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const logoutUser = async () => {
  return {
    message: "Logged out successfully",
  };
};