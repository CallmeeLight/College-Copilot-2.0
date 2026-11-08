import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Trash2, 
  X,
  Filter
} from "lucide-react";
import { Assignment } from "../types";

interface TasksScreenProps {
  assignments: Assignment[];
  onToggleComplete: (id: string) => void;
  onAddAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  assignments,
  onToggleComplete,
  onAddAssignment,
  onDeleteAssignment,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("Physics");
  const [newDueDate, setNewDueDate] = useState("Tomorrow, 09:00 AM");
  const [newCategory, setNewCategory] = useState<"today" | "soon" | "later">("soon");
  const [newPriority, setNewPriority] = useState<"urgent" | "medium" | "low">("medium");
  const [newEstMins, setNewEstMins] = useState<number>(45);

  const subjects = ["all", ...Array.from(new Set(assignments.map((a) => a.course)))];

  const filteredTasks = assignments.filter((a) => {
    if (filterSubject === "all") return true;
    return a.course === filterSubject;
  });

  const dueToday = filteredTasks.filter((a) => a.dueCategory === "today");
  const dueSoon = filteredTasks.filter((a) => a.dueCategory === "soon");
  const later = filteredTasks.filter((a) => a.dueCategory === "later");

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      course: newCourse,
      dueDate: newDueDate,
      dueCategory: newCategory,
      priority: newPriority,
      completed: false,
      estimatedMins: newEstMins,
    };

    onAddAssignment(task);
    setNewTitle("");
    setIsModalOpen(false);
  };

  const renderTaskSection = (title: string, count: number, tasks: Assignment[], badgeColor: string) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">
              {title}
            </h3>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {count}
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="py-6 text-center bg-white/40 border border-white/80 rounded-2xl text-xs text-slate-400 font-medium">
            No assignments in this category.
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => {
              return (
                <div
                  key={task.id}
                  id={`task-row-${task.id}`}
                  className={`rounded-[24px] p-4 sm:p-5 border transition-all duration-150 flex items-start justify-between gap-3 group ${
                    task.completed
                      ? "bg-white/30 border-white/50 opacity-55"
                      : "bg-white/60 border-white/80 hover:bg-white/80 hover:border-slate-300/80 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Checkbox Toggle Switch Button */}
                    <motion.button
                      type="button"
                      id={`toggle-task-${task.id}`}
                      onClick={() => onToggleComplete(task.id)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 600, damping: 25 }}
                      className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none"
                    >
                      {task.completed ? (
                        <motion.div
                          initial={{ scale: 0.6, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 drop-shadow-xs" />
                        </motion.div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 transition-colors" />
                      )}
                    </motion.button>

                    <div className="space-y-1 flex-1 min-w-0">
                      {/* Course tag & due time & priority */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-indigo-700">
                          {task.course}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          {task.dueDate}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ~{task.estimatedMins}m effort
                        </span>

                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          task.priority === "urgent"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : task.priority === "medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className={`text-sm sm:text-base font-semibold text-slate-900 leading-snug tracking-tight ${
                        task.completed ? "line-through text-slate-400 font-normal" : ""
                      }`}>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delete button on hover */}
                  <button
                    id={`delete-task-${task.id}`}
                    onClick={() => onDeleteAssignment(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 flex items-center gap-3">
            <span className="font-semibold">Academic Tasks</span> & Assignments
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Categorized academic delivery tracker &bull; Prioritized by urgency &bull; Estimated completion times
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter Pills with Smooth Sliding Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-slate-200/70 p-1.5 rounded-full border border-slate-300/50 shadow-inner shadow-slate-900/5 relative">
            {subjects.map((s) => {
              const isSelected = filterSubject === s;
              return (
                <button
                  key={s}
                  id={`filter-task-${s}`}
                  type="button"
                  onClick={() => setFilterSubject(s)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold capitalize transition-colors duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                    isSelected
                      ? "text-slate-900 font-bold"
                      : "text-slate-600 hover:text-slate-950 font-medium"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="tasks-subject-sliding-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm shadow-slate-900/10 border border-slate-200/90 pointer-events-none"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                        mass: 0.8,
                      }}
                    >
                      <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
                    </motion.div>
                  )}
                  <span className="relative z-10 block leading-tight">
                    {s === "all" ? "All Subjects" : s}
                  </span>
                </button>
              );
            })}
          </div>

          <motion.button
            id="add-assignment-btn"
            type="button"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </motion.button>
        </div>
      </div>

      {/* Task Groups */}
      <div className="space-y-8">
        {renderTaskSection("Due Today", dueToday.length, dueToday, "bg-rose-50 text-rose-700 border-rose-200")}
        {renderTaskSection("Due Soon", dueSoon.length, dueSoon, "bg-amber-50 text-amber-700 border-amber-200")}
        {renderTaskSection("Later", later.length, later, "bg-slate-100 text-slate-700 border-slate-200")}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-7 shadow-2xl border border-white/90 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <h3 className="text-base font-bold text-slate-900">
                Add New Assignment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="mt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Physics Homework #5: Wave Equations"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Subject</label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="BME Laboratory">BME Laboratory</option>
                    <option value="Programming">Programming</option>
                    <option value="Biology for Engineers">Biology for Engineers</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                  >
                    <option value="today">Due Today</option>
                    <option value="soon">Due Soon</option>
                    <option value="later">Later</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Due Date String</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. Tomorrow, 11:59 PM"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">Estimated Time (mins)</label>
                <input
                  type="number"
                  value={newEstMins}
                  onChange={(e) => setNewEstMins(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
