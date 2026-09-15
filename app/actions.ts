"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  
  if (!title || title.trim() === "") return;

  // create new task in db
  await prisma.task.create({
    data: { title },
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