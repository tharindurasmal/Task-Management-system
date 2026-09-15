import prisma from "@/lib/prisma";
import { createTask, deleteTask } from "./actions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {
  //current login session
  const session = await getServerSession();

  if (!session?.user?.email) {
    return (
      <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg text-center text-slate-800">
        <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
        <p className="mb-8 text-slate-500">Please log in to manage your tasks.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">Log In</Link>
          <Link href="/register" className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg font-semibold">Register</Link>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  const tasks = await prisma.task.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg text-slate-800">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-sm text-slate-500">Logged in as {session.user.email}</p>
        </div>
        <LogoutButton />
      </div>
      
      <form action={createTask} className="flex gap-3 mb-8">
        <input type="text" name="title" placeholder="What do you need to do?" className="border border-slate-300 p-3 rounded-lg w-full" required />
        <button type="submit" className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700">Add</button>
      </form>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="font-medium text-slate-700">{task.title}</span>
            <form action={deleteTask}>
              <input type="hidden" name="id" value={task.id} />
              <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
            </form>
          </li>
        ))}
      </ul>
      
      {tasks.length === 0 && <p className="text-slate-500 text-center mt-6">No tasks yet.</p>}
    </main>
  );
}