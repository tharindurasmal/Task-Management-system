import prisma from "@/lib/prisma";
import { createTask, deleteTask, updateTaskStatus } from "./actions";
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

  // separate tasks into to-do and completed
  const toDoTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg text-slate-800">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-sm text-slate-500">Logged in as {session.user.email}</p>
        </div>
        <LogoutButton />
      </div>
      
      <form action={createTask} className="flex gap-3 mb-10 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
        <input type="text" name="title" placeholder="What do you need to do?" className="flex-1 bg-transparent p-4 rounded-xl focus:outline-none text-slate-800" required />
        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700">Add Task</button>
      </form>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      <div className="bg-slate-200/50 p-6 rounded-3xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 uppercase text-sm">To Do ({toDoTasks.length})</h2>
        <div className="space-y-4">
          {toDoTasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-800 font-semibold text-lg mb-4">{task.title}</p>
              <div className="flex justify-between items-center">
                <form action={updateTaskStatus}>
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="status" value="completed" />
                  <button type="submit" className="bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-700 px-4 py-2 rounded-lg text-sm font-bold">Complete</button>
                </form>
                <form action={deleteTask}>
                  <input type="hidden" name="id" value={task.id} />
                  <button type="submit" className="text-red-400 hover:text-red-500 p-2 text-sm font-bold">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-200/50 p-6 rounded-3xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 uppercase text-sm">Completed ({completedTasks.length})</h2>
        <div className="space-y-4">
          {completedTasks.map((task) => (
            <div key={task.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 opacity-75">
              <p className="text-slate-500 font-medium text-lg mb-4 line-through">{task.title}</p>
              <div className="flex justify-between items-center">
                <form action={updateTaskStatus}>
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="status" value="todo" />
                  <button type="submit" className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold">Undo</button>
                </form>
                <form action={deleteTask}>
                  <input type="hidden" name="id" value={task.id} />
                  <button type="submit" className="text-red-400 hover:text-red-500 p-2 text-sm font-bold">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      
      {tasks.length === 0 && <p className="text-slate-500 text-center mt-6">No tasks yet.</p>}
    </main>
  );
}