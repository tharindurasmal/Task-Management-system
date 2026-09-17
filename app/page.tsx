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
      <main className="flex min-h-screen items-center justify-center bg-[#F1EFE8] px-6">
        <div className="w-full max-w-sm border border-[#D8D3C7] bg-[#FBFAF7] px-10 py-12 text-center shadow-[0_1px_2px_rgba(31,41,55,0.06)]">
          <p className="mb-1 font-mono text-[11px] tracking-wide text-[#8B7355]">
            A place to keep track
          </p>
          <h1 className="mb-3 font-serif text-4xl text-[#1F2937]">Task Manager</h1>
          <svg
            width="120"
            height="10"
            viewBox="0 0 120 10"
            fill="none"
            className="mx-auto mb-8 text-[#2F5233]"
          >
            <path
              d="M2 6C20 2 34 8 52 5C70 2 84 8 102 4C110 2.5 116 3 118 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="mb-8 text-[15px] leading-relaxed text-[#5B6472]">
            Log in to see what's on your list, or start a new one.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/login"
              className="bg-[#1F2937] px-6 py-2.5 text-[14px] font-medium text-[#FBFAF7] transition-colors hover:bg-[#2F5233]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="border border-[#D8D3C7] px-6 py-2.5 text-[14px] font-medium text-[#1F2937] transition-colors hover:border-[#1F2937]"
            >
              Register
            </Link>
          </div>
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  return (
    <main className="min-h-screen bg-[#F1EFE8] px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-1 font-mono text-[11px] tracking-wide text-[#8B7355]">{today}</p>
            <h1 className="font-serif text-4xl text-[#1F2937]">My tasks</h1>
            
          </div>
          <div className="pt-1 text-right">
            <p className="mb-1 text-[13px] text-[#8B9199]">{session.user.email}</p>
            <LogoutButton />
          </div>
        </div>

        {/* Add task */}
        <form
          action={createTask}
          className="mb-10 flex items-center gap-3 border-b-2 border-[#1F2937] pb-2"
        >
          <input
            type="text"
            name="title"
            placeholder="What do you need to do?"
            className="flex-1 bg-transparent text-[16px] text-[#1F2937] placeholder:text-[#A8A296] focus:outline-none"
            required
          />
          <button
            type="submit"
            className="shrink-0 bg-[#1F2937] px-5 py-2 text-[13px] font-medium text-[#FBFAF7] transition-colors hover:bg-[#2F5233]"
          >
            Add
          </button>
        </form>

        {/* Paper sheet with both lists */}
        <div className="border border-[#D8D3C7] bg-[#FBFAF7] shadow-[0_1px_2px_rgba(31,41,55,0.06)] md:grid md:grid-cols-2 md:divide-x md:divide-[#E4E0D6]">

          {/* To do */}
          <div className="px-7 py-7">
            <p className="mb-5 text-[13px] font-medium text-[#8B7355]">
              To do <span className="font-mono text-[12px] text-[#A8A296]">({toDoTasks.length})tasks</span>
            </p>

            {toDoTasks.length === 0 ? (
              <p className="text-[14px] italic text-[#A8A296]">
                Nothing here yet — add your first task above.
              </p>
            ) : (
              <div>
                {toDoTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 border-b border-[#E4E0D6] py-3 first:pt-0 last:border-none last:pb-0"
                  >
                    <form action={updateTaskStatus}>
                      <input type="hidden" name="id" value={task.id} />
                      <input type="hidden" name="status" value="completed" />
                      <button
                        type="submit"
                        aria-label={`Mark "${task.title}" as done`}
                        className="h-5 w-5 shrink-0 rounded-full border-2 border-[#2F5233] transition-colors hover:bg-[#2F5233]/10"
                      />
                    </form>
                    <p className="flex-1 text-[15px] text-[#1F2937]">{task.title}</p>
                    <form action={deleteTask}>
                      <input type="hidden" name="id" value={task.id} />
                      <button
                        type="submit"
                        aria-label={`Delete "${task.title}"`}
                        className="text-[12px] font-medium text-[#A13D3D] opacity-0 transition-opacity hover:text-[#7E2F2F] group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Done */}
          <div className="border-t border-[#E4E0D6] px-7 py-7 md:border-t-0">
            <p className="mb-5 text-[13px] font-medium text-[#8B7355]">
              Done <span className="font-mono text-[12px] text-[#A8A296]">({completedTasks.length})completed</span>
            </p>

            {completedTasks.length === 0 ? (
              <p className="text-[14px] italic text-[#A8A296]">
                Complete a task and it'll show up here.
              </p>
            ) : (
              <div>
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 border-b border-[#E4E0D6] py-3 first:pt-0 last:border-none last:pb-0"
                  >
                    <form action={updateTaskStatus}>
                      <input type="hidden" name="id" value={task.id} />
                      <input type="hidden" name="status" value="todo" />
                      
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                     
                        
                      
                    </form>
                    <p className="flex-1 text-[15px] text-[#A8A296] line-through decoration-[#D8D3C7]">
                      {task.title}
                    </p>
                    <form action={deleteTask}>
                      <input type="hidden" name="id" value={task.id} />
                      <button
                        type="submit"
                        aria-label={`Delete "${task.title}"`}
                        className="text-[12px] font-medium text-[#A13D3D] opacity-0 transition-opacity hover:text-[#7E2F2F] group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
