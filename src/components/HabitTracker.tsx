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
    <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#f7b125]" />
          <h3 className="font-bold text-[#e4e6eb] text-base">Chuỗi Thói Quen Hàng Ngày (Habit Streaks)</h3>
        </div>
        <span className="text-xs font-semibold text-[#1877f2] bg-[#1877f2]/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#1877f2]/20">
          <Trophy className="w-3.5 h-3.5 text-[#f7b125]" />
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
                ? 'bg-[#1877f2]/10 border-[#1877f2]/40 shadow-sm'
                : 'bg-[#18191a] border-[#393a3b] hover:bg-[#3a3b3c]/40'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-1">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#3a3b3c] text-[#b0b3b8]">
                  {habit.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#f7b125] font-mono">
                  <Flame className="w-3.5 h-3.5 fill-[#f7b125]" />
                  <span>{habit.streak} ngày</span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-[#e4e6eb] mt-2.5 leading-snug">
                {habit.name}
              </h4>
            </div>

            {/* Heatmap mini squares */}
            <div className="mt-3.5 pt-2.5 border-t border-[#393a3b] flex items-center justify-between">
              <div className="flex items-center gap-1">
                {habit.history.slice(-7).map((done, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-[3px] ${
                      done ? 'bg-[#31a24c]' : 'bg-[#3a3b3c]'
                    }`}
                  />
                ))}
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  habit.completedToday ? 'bg-[#31a24c] text-white font-bold' : 'border-2 border-[#393a3b] hover:border-[#b0b3b8]'
                }`}
              >
                {habit.completedToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
