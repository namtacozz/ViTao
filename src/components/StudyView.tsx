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
    <div className="space-y-4">
      {/* Top Academic Overview & Pomodoro Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CPA / GPA Summary Card */}
        <div className="lg:col-span-2 bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1877f2] uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Tiến Độ Học Tập & Điểm Số Tích Lũy</span>
            </div>
            <span className="text-xs font-semibold text-[#1877f2] bg-[#1877f2]/10 px-3 py-1 rounded-full border border-[#1877f2]/20">
              Mục tiêu CPA: {study.targetCpa}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b]">
              <div className="text-[11px] text-[#b0b3b8]">CPA Toàn Khóa</div>
              <div className="text-2xl font-black text-[#e4e6eb] mt-1">{cumulativeCpa} <span className="text-xs text-[#b0b3b8] font-normal">/ 4.0</span></div>
              <div className="text-[10px] text-[#31a24c] font-semibold">Xuất sắc</div>
            </div>

            <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b]">
              <div className="text-[11px] text-[#b0b3b8]">GPA Kỳ Này</div>
              <div className="text-2xl font-black text-[#1877f2] mt-1">
                {currentSemester?.gpa4 || 0} <span className="text-xs text-[#b0b3b8] font-normal">/ 4.0</span>
              </div>
              <div className="text-[10px] text-[#b0b3b8]">Hệ 10: {currentSemester?.gpa10 || 0}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b]">
              <div className="text-[11px] text-[#b0b3b8]">Tín Chỉ Đã Học</div>
              <div className="text-2xl font-black text-[#e4e6eb] mt-1">{totalCredits}</div>
              <div className="text-[10px] text-[#b0b3b8]">Kỳ này: {currentSemester?.courses.reduce((s, c) => s + c.credits, 0) || 0} tín</div>
            </div>

            <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b]">
              <div className="text-[11px] text-[#b0b3b8]">Deadline Chờ Xử Lý</div>
              <div className="text-2xl font-black text-[#f7b125] mt-1">
                {study.tasks.filter(t => t.status !== 'completed').length}
              </div>
              <div className="text-[10px] text-[#b0b3b8]">Cần hoàn thành</div>
            </div>
          </div>

          {/* Progress bar towards target */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-[#b0b3b8]">
              <span>Tiến độ đạt mục tiêu ({cumulativeCpa} / {study.targetCpa})</span>
              <span className="font-mono text-[#1877f2] font-bold">
                {Math.min(100, Math.round((Number(cumulativeCpa) / study.targetCpa) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#18191a] overflow-hidden border border-[#393a3b]">
              <div
                className="h-full rounded-full bg-[#1877f2] transition-all duration-500"
                style={{ width: `${Math.min(100, (Number(cumulativeCpa) / study.targetCpa) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pomodoro Focus Timer Widget */}
        <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1877f2] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Pomodoro Tập Trung</span>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold ${pomoMode === 'work' ? 'bg-[#1877f2]/20 text-[#1877f2]' : 'bg-[#31a24c]/20 text-[#31a24c]'}`}>
              {pomoMode === 'work' ? 'Đang Học' : 'Nghỉ Ngơi'}
            </span>
          </div>

          <div className="text-center py-4">
            <div className="font-mono text-4xl sm:text-5xl font-black text-[#e4e6eb] tracking-widest">
              {pomoMinutes.toString().padStart(2, '0')}:{pomoSeconds.toString().padStart(2, '0')}
            </div>
            <p className="text-xs text-[#b0b3b8] mt-1">
              {pomoMode === 'work' ? '25 phút tập trung cao độ, không xao nhãng' : '5 phút thư giãn mắt'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#393a3b]">
            <button
              onClick={() => setPomoActive(!pomoActive)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                pomoActive
                  ? 'bg-[#e41e3f] hover:bg-[#d01737] text-white'
                  : 'bg-[#1877f2] hover:bg-[#166fe5] text-white shadow-sm'
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
              className="p-2 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] transition-colors"
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
              className="p-2 rounded-full bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#1877f2] transition-colors"
            >
              <Music className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Course & Semester Grade Table Section */}
      <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#e4e6eb] text-base">Bảng Điểm Theo Học Kỳ</h3>
            {/* Semester selector */}
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-sm transition-all"
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
              <tr className="border-b border-[#393a3b] text-[#b0b3b8] font-semibold">
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
            <tbody className="divide-y divide-[#393a3b]/60">
              {currentSemester?.courses.map(c => (
                <tr key={c.id} className="hover:bg-[#3a3b3c]/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-[#1877f2] font-semibold">{c.code}</td>
                  <td className="py-3 px-3 font-medium text-[#e4e6eb]">{c.name}</td>
                  <td className="py-3 px-3 text-center font-mono text-[#b0b3b8]">{c.credits}</td>
                  <td className="py-3 px-3 text-center font-mono text-[#b0b3b8]">{c.scoreProcess ?? '-'}</td>
                  <td className="py-3 px-3 text-center font-mono text-[#b0b3b8]">{c.scoreExam ?? '-'}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#e4e6eb]">{c.score10}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-[#31a24c]">{c.score4}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-[#3a3b3c] text-[#e4e6eb] font-bold font-mono">
                      {c.letterGrade}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1.5 rounded-full text-[#b0b3b8] hover:text-[#e41e3f] hover:bg-[#3a3b3c] transition-colors"
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1877f2]" />
            <h3 className="font-bold text-[#e4e6eb] text-base">Quản Lý Nhiệm Vụ & Deadline (Kanban)</h3>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Giao Việc Mới</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column: To Do */}
          <div className="bg-[#242526] rounded-xl p-4 border border-[#393a3b] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#e4e6eb] border-b border-[#393a3b] pb-2">
              <span>Cần Làm (To Do)</span>
              <span className="px-2 py-0.5 rounded-full bg-[#3a3b3c] text-[10px] font-mono text-[#b0b3b8]">
                {study.tasks.filter(t => t.status === 'todo').length}
              </span>
            </div>
            <div className="space-y-2">
              {study.tasks.filter(t => t.status === 'todo').map(task => (
                <div key={task.id} className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b] space-y-2 group hover:border-[#1877f2]/40 transition-colors">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold text-[#e4e6eb]">{task.title}</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(task.id)} className="text-[#b0b3b8] hover:text-[#e41e3f]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {task.description && <p className="text-[11px] text-[#b0b3b8]">{task.description}</p>}
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-[#1877f2] font-mono">Hạn: {task.dueDate}</span>
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="px-2.5 py-1 rounded-md bg-[#1877f2]/15 text-[#1877f2] hover:bg-[#1877f2]/25 font-semibold text-[11px] transition-colors"
                    >
                      Bắt đầu →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="bg-[#242526] rounded-xl p-4 border border-[#393a3b] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#1877f2] border-b border-[#393a3b] pb-2">
              <span>Đang Xử Lý (In Progress)</span>
              <span className="px-2 py-0.5 rounded-full bg-[#1877f2]/20 text-[#1877f2] text-[10px] font-mono font-bold">
                {study.tasks.filter(t => t.status === 'in-progress').length}
              </span>
            </div>
            <div className="space-y-2">
              {study.tasks.filter(t => t.status === 'in-progress').map(task => (
                <div key={task.id} className="p-3 rounded-lg bg-[#18191a] border border-[#1877f2]/40 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-semibold text-[#e4e6eb]">{task.title}</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(task.id)} className="text-[#b0b3b8] hover:text-[#e41e3f]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  {task.description && <p className="text-[11px] text-[#b0b3b8]">{task.description}</p>}
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-[#f7b125] font-mono">Hạn: {task.dueDate}</span>
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="px-2.5 py-1 rounded-md bg-[#31a24c]/15 text-[#31a24c] hover:bg-[#31a24c]/25 font-semibold flex items-center gap-1 text-[11px] transition-colors"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Xong</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="bg-[#242526] rounded-xl p-4 border border-[#393a3b] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#31a24c] border-b border-[#393a3b] pb-2">
              <span>Đã Hoàn Thành (Done)</span>
              <span className="px-2 py-0.5 rounded-full bg-[#31a24c]/20 text-[#31a24c] text-[10px] font-mono font-bold">
                {study.tasks.filter(t => t.status === 'completed').length}
              </span>
            </div>
            <div className="space-y-2">
              {study.tasks.filter(t => t.status === 'completed').map(task => (
                <div key={task.id} className="p-3 rounded-lg bg-[#18191a]/60 border border-[#393a3b] space-y-1 opacity-70">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-medium line-through text-[#b0b3b8]">{task.title}</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteTask(task.id)} className="text-[#b0b3b8] hover:text-[#e41e3f]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-[#31a24c] font-semibold">Hoàn thành</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddCourseSubmit} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base">Thêm Môn Học Vào Học Kỳ</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Mã Môn</label>
                <input
                  type="text"
                  placeholder="IT3040"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Số Tín Chỉ</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Môn Học</label>
                <input
                  type="text"
                  placeholder="Lập Trình Web Nâng Cao"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Điểm Quá Trình</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCourse.scoreProcess}
                  onChange={(e) => handleScoreCalc(Number(e.target.value), newCourse.scoreExam || 0, newCourse.credits || 3)}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Điểm Thi Cuối Kỳ</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCourse.scoreExam}
                  onChange={(e) => handleScoreCalc(newCourse.scoreProcess || 0, Number(e.target.value), newCourse.credits || 3)}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b] text-xs flex justify-between">
              <span>Hệ 10: <strong className="text-[#1877f2]">{newCourse.score10}</strong></span>
              <span>Hệ 4: <strong className="text-[#31a24c]">{newCourse.score4}</strong></span>
              <span>Điểm Chữ: <strong className="text-[#e4e6eb]">{newCourse.letterGrade}</strong></span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCourse(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
              >
                Thêm Môn
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddTaskSubmit} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base">Giao Nhiệm Vụ / Bài Tập Mới</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tiêu Đề Công Việc</label>
                <input
                  type="text"
                  placeholder="Làm bài tập lớn Cơ sở dữ liệu"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Môn Học / Dự Án</label>
                <input
                  type="text"
                  placeholder="Cơ Sở Dữ Liệu"
                  value={newTask.courseName}
                  onChange={(e) => setNewTask({ ...newTask, courseName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Hạn Chót (Deadline)</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
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
