"use server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { message: "Invalid fields", status :"error" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email)
  if (existingUser)  {
    return {message : "Email already in use!" , status : "error"}
  }

  await db.user.create({
    data : {
      name,
      email,
      password : hashedPassword
    }
  })


  return { message: "Register successfully" , status : "success" };
};
