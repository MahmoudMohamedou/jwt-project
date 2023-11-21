import { context } from "../config.js";
import bcrypt from "bcrypt";

export const createUser = async (input) => {
  const { password } = input;

  console.log(input);

  const salt = 10;

  // hash password

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await context.prismaClient.user.create({
    data: {
      ...input,
      password: hashedPassword,
    },
  });

  return user;
};

export const findUserById = async (id) => {
  const user = await context.prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};
