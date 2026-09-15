"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function createTask(formData: FormData) {
  const session = await getServerSession();
  if(!session?.user?.email) {
    throw new Error("You must be logged in to create a task.");
  }

  const title = formData.get("title") as string;
  
  if (!title || title.trim() === "") return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found.");
  }

  // create new task in db
  await prisma.task.create({
    data: { title, userId: user.id },
  });

  // refresh page
  revalidatePath("/");
}

export async function deleteTask(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) return;

  // delete task from db
  await prisma.task.delete({
    where: { id },
  });

  // refresh page
  revalidatePath("/");
}