import React, { useState } from 'react';
import { Flame, Check, Plus, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  completedToday: boolean;
  history: boolean[]; // last 14 days
}

export const HabitTracker: React.FC = () => {
  const { isAdmin } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 'h1',
      name: 'Leo 1 Trận Rank ĐTCL / LoL',
      category: 'Gaming',
      streak: 12,
      completedToday: true,
      history: [true, true, true, false, true, true, true, true, true, true, true, true, true, true]
    },
    {
      id: 'h2',
      name: 'Code ít nhất 1 Commit lên GitHub',
      category: 'Dev',
      streak: 19,
      completedToday: true,
      history: [true, true, true, true, true, true, true, true, true, true, true, true, true, true]
    },
    {
      id: 'h3',
      name: 'Hoàn thành 1 phiên Pomodoro (25p)',
      category: 'Study',
      streak: 8,
      completedToday: false,
      history: [false, true, true, true, true, true, true, false, true, true, true, true, true, false]
    },
    {
      id: 'h4',
      name: 'Tập thể dục & Uống 2L nước',
      category: 'Health',
      streak: 5,
      completedToday: true,
      history: [false, false, true, true, true, false, true, true, true, true, true, false, true, true]
    }
  ]);

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const nextCompleted = !h.completedToday;
          return {
            ...h,
            completedToday: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
          };
        }
        return h;
      })
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">Chuỗi Thói Quen Hàng Ngày (Habit Streaks)</h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/60 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Kỷ lục: 19 ngày liên tiếp</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {habits.map(habit => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              habit.completedToday
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-1">
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
                  {habit.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{habit.streak} ngày</span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-white mt-2 leading-snug">
                {habit.name}
              </h4>
            </div>

            {/* Heatmap mini squares */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {habit.history.slice(-7).map((done, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-[2px] ${
                      done ? 'bg-emerald-400' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  habit.completedToday ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700'
                }`}
              >
                {habit.completedToday && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
