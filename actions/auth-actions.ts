"use server"

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { loginSchema, loginSchemaType } from "@/schemas/loginSchema";
import { registerSchema, registerSchemaType } from "@/schemas/registerSchema";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs"
import { redirect } from "next/dist/server/api-utils";


export const loginAction = async (values: loginSchemaType) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};

export const registerAction = async (values: registerSchemaType) => {
  try {
    const { data, success } = registerSchema.safeParse(values);

    if (!success) {
      return {
        error: "Dados inválidos"
      }
    }

    //Verificar se usuário ja existe
    const user = await db.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (user) {
      return {
        error: "Usuário com este e-mail já existe"
      }
    }

    //hash da senha
    const passwordHash = await bcrypt.hash(data.password, 10);

    await db.user.create({
      data: {
        ...data,
        password: passwordHash
      }
    })

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false
    })

    return { success: true };

  }
  catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
}
