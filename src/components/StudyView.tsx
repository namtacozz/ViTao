import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Music,
  BarChart3,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { Course, StudyTask, Semester } from '../types';

export const StudyView: React.FC = () => {
  const { data, updateStudy } = useData();
  const { isAdmin } = useAuth();
  const { playTrack } = usePlayer();
  const study = data.study;

  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(
    study.semesters[0]?.id || ''
  );

  // Modals
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // New Course Form state
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    code: '',
    name: '',
    credits: 3,
    scoreProcess: 8.5,
    scoreExam: 8.5,
    score10: 8.5,
    score4: 3.5,
    letterGrade: 'B+'
  });

  // New Task Form state
  const [newTask, setNewTask] = useState<Partial<StudyTask>>({
    title: '',
    courseName: '',
    dueDate: new Date().toISOString().slice(0, 10),
    priority: 'normal',
    status: 'todo'
  });

  // Pomodoro Focus Timer State
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'break'>('work');

  // Pomodoro Interval
  React.useEffect(() => {
    let interval: any = null;
    if (pomoActive) {
      interval = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoMinutes > 0) {
          setPomoMinutes(pomoMinutes - 1);
          setPomoSeconds(59);
        } else {
          // Timer finished
          setPomoActive(false);
          if (pomoMode === 'work') {
            alert('🎉 Kết thúc phiên tập trung 25 phút! Hãy giải lao 5 phút nhé.');
            setPomoMode('break');
            setPomoMinutes(5);
            setPomoSeconds(0);
          } else {
            alert('🔔 Hết giờ giải lao! Sẵn sàng vào phiên tập trung mới nào.');
            setPomoMode('work');
            setPomoMinutes(25);
            setPomoSeconds(0);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoMinutes, pomoSeconds, pomoMode]);

  const currentSemester = study.semesters.find(s => s.id === selectedSemesterId) || study.semesters[0];

  // Calculate Cumulative CPA across all semesters
  const totalCredits = study.semesters.reduce(
    (acc, sem) => acc + sem.courses.reduce((cAcc, c) => cAcc + c.credits, 0),
    0
  );
  const totalScoreWeight = study.semesters.reduce(
    (acc, sem) => acc + sem.courses.reduce((cAcc, c) => cAcc + c.score4 * c.credits, 0),
    0
  );
  const cumulativeCpa = totalCredits > 0 ? (totalScoreWeight / totalCredits).toFixed(2) : '0.00';

  // Helper to calculate Grade from 10 to letter & 4
  const handleScoreCalc = (p: number, e: number, credits: number) => {
    const final10 = parseFloat((p * 0.3 + e * 0.7).toFixed(1));
    let letter = 'F';
    let g4 = 0.0;
    if (final10 >= 9.0) { letter = 'A+'; g4 = 4.0; }
    else if (final10 >= 8.5) { letter = 'A'; g4 = 3.7; }
    else if (final10 >= 8.0) { letter = 'B+'; g4 = 3.5; }
    else if (final10 >= 7.0) { letter = 'B'; g4 = 3.0; }
    else if (final10 >= 6.5) { letter = 'C+'; g4 = 2.5; }
    else if (final10 >= 5.5) { letter = 'C'; g4 = 2.0; }
    else if (final10 >= 5.0) { letter = 'D+'; g4 = 1.5; }
    else if (final10 >= 4.0) { letter = 'D'; g4 = 1.0; }

    setNewCourse(prev => ({
      ...prev,
      scoreProcess: p,
      scoreExam: e,
      score10: final10,
      score4: g4,
      letterGrade: letter
    }));
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code || !currentSemester) return;

    const courseToAdd: Course = {
      id: `c-${Date.now()}`,
      code: newCourse.code.toUpperCase(),
      name: newCourse.name,
      credits: Number(newCourse.credits) || 3,
      scoreProcess: Number(newCourse.scoreProcess) || 0,
      scoreExam: Number(newCourse.scoreExam) || 0,
      score10: Number(newCourse.score10) || 0,
      score4: Number(newCourse.score4) || 0,
      letterGrade: newCourse.letterGrade || 'B'
    };

    const updatedCourses = [...currentSemester.courses, courseToAdd];
    const semCredits = updatedCourses.reduce((sum, c) => sum + c.credits, 0);
    const semPoints = updatedCourses.reduce((sum, c) => sum + c.score4 * c.credits, 0);
    const updatedGpa4 = parseFloat((semPoints / semCredits).toFixed(2));

    const updatedSemesters = study.semesters.map(s =>
      s.id === currentSemester.id ? { ...s, courses: updatedCourses, gpa4: updatedGpa4 } : s
    );

    updateStudy({ semesters: updatedSemesters });
    setShowAddCourse(false);
    setNewCourse({ code: '', name: '', credits: 3, scoreProcess: 8.5, scoreExam: 8.5, score10: 8.5, score4: 3.5, letterGrade: 'B+' });
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!currentSemester) return;
    const updatedCourses = currentSemester.courses.filter(c => c.id !== courseId);
    const semCredits = updatedCourses.reduce((sum, c) => sum + c.credits, 0) || 1;
    const semPoints = updatedCourses.reduce((sum, c) => sum + c.score4 * c.credits, 0);
    const updatedGpa4 = parseFloat((semPoints / semCredits).toFixed(2));

    const updatedSemesters = study.semesters.map(s =>
      s.id === currentSemester.id ? { ...s, courses: updatedCourses, gpa4: updatedGpa4 } : s
    );
    updateStudy({ semesters: updatedSemesters });
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const taskToAdd: StudyTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      courseName: newTask.courseName || 'Học tập',
      dueDate: newTask.dueDate || new Date().toISOString().slice(0, 10),
      priority: (newTask.priority as any) || 'normal',
      status: (newTask.status as any) || 'todo'
    };

    updateStudy({ tasks: [taskToAdd, ...study.tasks] });
    setShowAddTask(false);
    setNewTask({ title: '', courseName: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'normal', status: 'todo' });
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const updated = study.tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'todo' ? 'in-progress' : (t.status === 'in-progress' ? 'completed' : 'todo');
        return { ...t, status: nextStatus as any };
      }
      return t;
    });
    updateStudy({ tasks: updated });
  };

  const handleDeleteTask = (taskId: string) => {
    updateStudy({ tasks: study.tasks.filter(t => t.id !== taskId) });
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Overview & Pomodoro Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CPA / GPA Summary Card */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Tiến Độ Học Tập & Điểm Số Tích Lũy</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              Mục tiêu CPA: {study.targetCpa}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">CPA Toàn Khóa</div>
              <div className="text-2xl font-black text-white mt-1">{cumulativeCpa} <span className="text-xs text-slate-400 font-normal">/ 4.0</span></div>
              <div className="text-[10px] text-emerald-400 font-medium">Xuất sắc</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">GPA Kỳ Này</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {currentSemester?.gpa4 || 0} <span className="text-xs text-slate-400 font-normal">/ 4.0</span>
              </div>
              <div className="text-[10px] text-cyan-400">Hệ 10: {currentSemester?.gpa10 || 0}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Tín Chỉ Đã Học</div>
              <div className="text-2xl font-black text-white mt-1">{totalCredits}</div>
              <div className="text-[10px] text-slate-400">Kỳ này: {currentSemester?.courses.reduce((s, c) => s + c.credits, 0) || 0} tín</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Deadline Chờ Xử Lý</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {study.tasks.filter(t => t.status !== 'completed').length}
              </div>
              <div className="text-[10px] text-amber-300/80">Cần hoàn thành</div>
            </div>
          </div>

          {/* Progress bar towards target */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Tiến độ đạt mục tiêu ({cumulativeCpa} / {study.targetCpa})</span>
              <span className="font-mono text-emerald-400">
                {Math.min(100, Math.round((Number(cumulativeCpa) / study.targetCpa) * 100))}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (Number(cumulativeCpa) / study.targetCpa) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pomodoro Focus Timer Widget */}
        <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Pomodoro Tập Trung</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${pomoMode === 'work' ? 'bg-purple-950 text-purple-300' : 'bg-emerald-950 text-emerald-300'}`}>
              {pomoMode === 'work' ? 'Đang Học' : 'Nghỉ Ngơi'}
            </span>
          </div>

          <div className="text-center py-4">
            <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest">
              {pomoMinutes.toString().padStart(2, '0')}:{pomoSeconds.toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {pomoMode === 'work' ? '25 phút tập trung cao độ, không xao nhãng' : '5 phút thư giãn mắt'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setPomoActive(!pomoActive)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pomoActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-neon-purple'
              }`}
            >
              {pomoActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{pomoActive ? 'Tạm Dừng' : 'Bắt Đầu'}</span>
            </button>

            <button
              onClick={() => {
                setPomoActive(false);
                setPomoMinutes(pomoMode === 'work' ? 25 : 5);
                setPomoSeconds(0);
              }}
              title="Đặt lại đồng hồ"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() =>
                playTrack(
                  {
                    id: 'lofi-focus',
                    title: 'Lofi Hip Hop Radio - Beats to Study',
                    artist: 'Lofi Girl',
                    youtubeId: 'jfKfPfyJRdk',
                    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=150&q=80'
                  },
                  'music'
                )
              }
              title="Bật nhạc Lofi học bài"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300"
            >
              <Music className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Course & Semester Grade Table Section */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Bảng Điểm Theo Học Kỳ</h3>
            {/* Semester selector */}
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-semibold focus:outline-none focus:border-cyan-500"
            >
              {study.semesters.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddCourse(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Môn Học Mới</span>
            </button>
          )}
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Mã Môn</th>
                <th className="py-2.5 px-3">Tên Môn Học</th>
                <th className="py-2.5 px-3 text-center">Tín Chỉ</th>
                <th className="py-2.5 px-3 text-center">Điểm QT (30%)</th>
                <th className="py-2.5 px-3 text-center">Điểm Thi (70%)</th>
                <th className="py-2.5 px-3 text-center">Hệ 10</th>
                <th className="py-2.5 px-3 text-center">Hệ 4</th>
                <th className="py-2.5 px-3 text-center">Điểm Chữ</th>
                {isAdmin && <th className="py-2.5 px-3 text-right">Xóa</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentSemester?.courses.map(c => (
                <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{c.code}</td>
                  <td className="py-3 px-3 font-medium text-white">{c.name}</td>
                  <td className="py-3 px-3 text-center font-mono">{c.credits}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{c.scoreProcess ?? '-'}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{c.scoreExam ?? '-'}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-white">{c.score10}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">{c.score4}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold font-mono">
                      {c.letterGrade}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
                        title="Xóa môn học này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Kanban Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Quản Lý Nhiệm Vụ & Deadline (Kanban)</h3>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Giao Việc Mới</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column: To Do */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-2">
              <span>Cần Làm (To Do)</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono">
                {study.tasks.filter(t => t.status === 'todo').length}
              </span>
            </div>
            <div className="space-y-2">
              {study.tasks.filter(t => t.status === 'todo').map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 group">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold text-white">{task.title}</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(task.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {task.description && <p className="text-[11px] text-slate-400">{task.description}</p>}
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-cyan-400 font-mono">Hạn: {task.dueDate}</span>
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 hover:bg-blue-900"
                    >
                      Bắt đầu →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="glass-card rounded-2xl p-4 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-300 border-b border-slate-800 pb-2">
              <span>Đang Xử Lý (In Progress)</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-mono">
                {study.tasks.filter(t => t.status === 'in-progress').length}
              </span>
            </div>
            <div className="space-y-2">
              {study.tasks.filter(t => t.status === 'in-progress').map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold text-white">{task.title}</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(task.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {task.description && <p className="text-[11px] text-slate-400">{task.description}</p>}
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-amber-400 font-mono">Hạn: {task.dueDate}</span>
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Xong</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 border-b border-slate-800 pb-2">
              <span>Đã Hoàn Thành (Done)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono">
                {study.tasks.filter(t => t.status === 'completed').length}
              </span>
            </div>
            <div className="space-y-2">
              {study.tasks.filter(t => t.status === 'completed').map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1 opacity-75">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-medium line-through text-slate-400">{task.title}</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(task.id)} className="text-slate-600 hover:text-rose-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-emerald-400">Hoàn thành</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleAddCourseSubmit} className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-700 space-y-4">
            <h4 className="font-bold text-white text-sm">Thêm Môn Học Vào Học Kỳ</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Mã Môn</label>
                <input
                  type="text"
                  placeholder="IT3040"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Số Tín Chỉ</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">Tên Môn Học</label>
                <input
                  type="text"
                  placeholder="Lập Trình Web Nâng Cao"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Điểm Quá Trình</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCourse.scoreProcess}
                  onChange={(e) => handleScoreCalc(Number(e.target.value), newCourse.scoreExam || 0, newCourse.credits || 3)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Điểm Thi Cuối Kỳ</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCourse.scoreExam}
                  onChange={(e) => handleScoreCalc(newCourse.scoreProcess || 0, Number(e.target.value), newCourse.credits || 3)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex justify-between">
              <span>Hệ 10: <strong className="text-cyan-400">{newCourse.score10}</strong></span>
              <span>Hệ 4: <strong className="text-emerald-400">{newCourse.score4}</strong></span>
              <span>Điểm Chữ: <strong className="text-purple-400">{newCourse.letterGrade}</strong></span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCourse(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Thêm Môn
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleAddTaskSubmit} className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-700 space-y-4">
            <h4 className="font-bold text-white text-sm">Giao Nhiệm Vụ / Bài Tập Mới</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Tiêu Đề Công Việc</label>
                <input
                  type="text"
                  placeholder="Làm bài tập lớn Cơ sở dữ liệu"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Môn Học / Dự Án</label>
                <input
                  type="text"
                  placeholder="Cơ Sở Dữ Liệu"
                  value={newTask.courseName}
                  onChange={(e) => setNewTask({ ...newTask, courseName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Hạn Chót (Deadline)</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white"
              >
                Tạo Nhiệm Vụ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
