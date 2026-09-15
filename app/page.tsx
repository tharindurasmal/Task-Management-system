import prisma from "@/lib/prisma";
import { createTask, deleteTask } from "./actions";

export default async function Home() {
  // get all tasks from db
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg text-slate-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">Task Manager</h1>
      
      {/* Create task form */}
      <form action={createTask} className="flex gap-3 mb-8">
        <input 
          type="text" 
          name="title" 
          placeholder="Add a new task..." 
          className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
        />
        <button type="submit" className="bg-blue-600 font-semibold text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Add
        </button>
      </form>

      {/* List all tasks */}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="font-medium text-slate-700">{task.title}</span>
            
            {/* delete task form db */}
            <form action={deleteTask}>
              <input type="hidden" name="id" value={task.id} />
              <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      
      {tasks.length === 0 && (
        <p className="text-slate-500 text-center mt-6">No tasks yet. Add one above!</p>
      )}
    </main>
  );
}