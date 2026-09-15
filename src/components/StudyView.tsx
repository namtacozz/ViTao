import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Calendar,
  Check,
  TrendingUp,
  Award,
  FolderPlus
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Course, Semester } from '../types';

export const StudyView: React.FC = () => {
  const { data, updateStudy } = useData();
  const { isAdmin } = useAuth();
  const study = data.study;

  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(
    study.semesters[0]?.id || ''
  );

  // Modals state
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddSemester, setShowAddSemester] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState('');
  const [targetCpaInput, setTargetCpaInput] = useState<number>(study.targetCpa || 3.6);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

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

  const currentSemester =
    study.semesters.find(s => s.id === selectedSemesterId) || study.semesters[0];

  // Helper to calculate Grade from Process (30%) & Exam (70%)
  const calculateGrade = (p: number, e: number) => {
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

    return { final10, g4, letter };
  };

  // Recalculate Semester GPA & CPA
  const recalculateSemester = (courses: Course[]) => {
    const semCredits = courses.reduce((sum, c) => sum + c.credits, 0) || 1;
    const semPoints = courses.reduce((sum, c) => sum + c.score4 * c.credits, 0);
    const sem10Points = courses.reduce((sum, c) => sum + c.score10 * c.credits, 0);
    const gpa4 = parseFloat((semPoints / semCredits).toFixed(2));
    const gpa10 = parseFloat((sem10Points / semCredits).toFixed(2));
    return { gpa4, gpa10 };
  };

  // Overall CPA & Total Credits
  const totalCredits = study.semesters.reduce(
    (acc, sem) => acc + sem.courses.reduce((cAcc, c) => cAcc + c.credits, 0),
    0
  );
  const totalScoreWeight = study.semesters.reduce(
    (acc, sem) => acc + sem.courses.reduce((cAcc, c) => cAcc + c.score4 * c.credits, 0),
    0
  );
  const cumulativeCpa = totalCredits > 0 ? (totalScoreWeight / totalCredits).toFixed(2) : '0.00';

  const getRankBadge = (cpa: number) => {
    if (cpa >= 3.6) return { text: 'Xuất Sắc', color: 'text-[#31a24c] bg-[#31a24c]/10 border-[#31a24c]/30' };
    if (cpa >= 3.2) return { text: 'Giỏi', color: 'text-[#1877f2] bg-[#1877f2]/10 border-[#1877f2]/30' };
    if (cpa >= 2.5) return { text: 'Khá', color: 'text-[#f7b125] bg-[#f7b125]/10 border-[#f7b125]/30' };
    return { text: 'Trung Bình', color: 'text-[#b0b3b8] bg-[#3a3b3c] border-[#393a3b]' };
  };

  const rankBadge = getRankBadge(Number(cumulativeCpa));

  // Add New Semester
  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSemesterName.trim()) return;

    const newSem: Semester = {
      id: `sem-${Date.now()}`,
      name: newSemesterName.trim(),
      year: '2025-2026',
      gpa4: 0,
      gpa10: 0,
      courses: []
    };

    const updated = [...study.semesters, newSem];
    updateStudy({ semesters: updated });
    setSelectedSemesterId(newSem.id);
    setNewSemesterName('');
    setShowAddSemester(false);
  };

  // Delete Semester
  const handleDeleteSemester = (semId: string) => {
    if (study.semesters.length <= 1) {
      alert('Phải giữ lại ít nhất 1 học kỳ!');
      return;
    }
    if (!confirm('Bạn có chắc muốn xóa học kỳ này và toàn bộ môn học trong kỳ không?')) return;

    const updated = study.semesters.filter(s => s.id !== semId);
    updateStudy({ semesters: updated });
    if (selectedSemesterId === semId) {
      setSelectedSemesterId(updated[0].id);
    }
  };

  // Add Course Submit
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code || !currentSemester) return;

    const { final10, g4, letter } = calculateGrade(
      Number(newCourse.scoreProcess) || 0,
      Number(newCourse.scoreExam) || 0
    );

    const courseToAdd: Course = {
      id: `c-${Date.now()}`,
      code: newCourse.code.toUpperCase().trim(),
      name: newCourse.name.trim(),
      credits: Number(newCourse.credits) || 3,
      scoreProcess: Number(newCourse.scoreProcess) || 0,
      scoreExam: Number(newCourse.scoreExam) || 0,
      score10: final10,
      score4: g4,
      letterGrade: letter
    };

    const updatedCourses = [...currentSemester.courses, courseToAdd];
    const { gpa4, gpa10 } = recalculateSemester(updatedCourses);

    const updatedSemesters = study.semesters.map(s =>
      s.id === currentSemester.id
        ? { ...s, courses: updatedCourses, gpa4, gpa10 }
        : s
    );

    updateStudy({ semesters: updatedSemesters });
    setShowAddCourse(false);
    setNewCourse({
      code: '',
      name: '',
      credits: 3,
      scoreProcess: 8.5,
      scoreExam: 8.5,
      score10: 8.5,
      score4: 3.5,
      letterGrade: 'B+'
    });
  };

  // Save Edit Course
  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !currentSemester) return;

    const { final10, g4, letter } = calculateGrade(
      Number(editingCourse.scoreProcess) || 0,
      Number(editingCourse.scoreExam) || 0
    );

    const updatedCourse: Course = {
      ...editingCourse,
      score10: final10,
      score4: g4,
      letterGrade: letter
    };

    const updatedCourses = currentSemester.courses.map(c =>
      c.id === updatedCourse.id ? updatedCourse : c
    );
    const { gpa4, gpa10 } = recalculateSemester(updatedCourses);

    const updatedSemesters = study.semesters.map(s =>
      s.id === currentSemester.id
        ? { ...s, courses: updatedCourses, gpa4, gpa10 }
        : s
    );

    updateStudy({ semesters: updatedSemesters });
    setEditingCourse(null);
  };

  // Delete Course
  const handleDeleteCourse = (courseId: string) => {
    if (!currentSemester) return;
    const updatedCourses = currentSemester.courses.filter(c => c.id !== courseId);
    const { gpa4, gpa10 } = recalculateSemester(updatedCourses);

    const updatedSemesters = study.semesters.map(s =>
      s.id === currentSemester.id
        ? { ...s, courses: updatedCourses, gpa4, gpa10 }
        : s
    );
    updateStudy({ semesters: updatedSemesters });
  };

  return (
    <div className="space-y-4">
      {/* 1. Academic Performance & Cumulative CPA Banner */}
      <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1877f2] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Tiến Độ Học Tập & Bảng Điểm Tích Lũy</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${rankBadge.color}`}>
              Xếp loại: {rankBadge.text}
            </span>
            {isEditingTarget ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="4"
                  value={targetCpaInput}
                  onChange={(e) => setTargetCpaInput(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded bg-[#3a3b3c] border border-[#393a3b] text-xs text-[#e4e6eb] font-bold"
                />
                <button
                  onClick={() => {
                    updateStudy({ targetCpa: targetCpaInput });
                    setIsEditingTarget(false);
                  }}
                  className="p-1 rounded bg-[#1877f2] text-white hover:bg-[#166fe5]"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTarget(true)}
                className="text-xs font-semibold text-[#1877f2] bg-[#1877f2]/10 hover:bg-[#1877f2]/20 px-3 py-1 rounded-full border border-[#1877f2]/20 transition-colors"
                title="Bấm để chỉnh mục tiêu"
              >
                Mục tiêu CPA: {study.targetCpa}
              </button>
            )}
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#18191a] border border-[#393a3b]">
            <div className="text-[11px] text-[#b0b3b8]">CPA Toàn Khóa</div>
            <div className="text-2xl sm:text-3xl font-black text-[#e4e6eb] mt-1">
              {cumulativeCpa} <span className="text-xs text-[#b0b3b8] font-normal">/ 4.0</span>
            </div>
            <div className="text-[10px] text-[#31a24c] font-semibold mt-0.5">Tích lũy toàn bộ môn</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#18191a] border border-[#393a3b]">
            <div className="text-[11px] text-[#b0b3b8]">GPA Học Kỳ Này</div>
            <div className="text-2xl sm:text-3xl font-black text-[#1877f2] mt-1">
              {currentSemester?.gpa4 || 0} <span className="text-xs text-[#b0b3b8] font-normal">/ 4.0</span>
            </div>
            <div className="text-[10px] text-[#b0b3b8] mt-0.5">Hệ 10: {currentSemester?.gpa10 || 0}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#18191a] border border-[#393a3b]">
            <div className="text-[11px] text-[#b0b3b8]">Tổng Tín Chỉ Tích Lũy</div>
            <div className="text-2xl sm:text-3xl font-black text-[#e4e6eb] mt-1">{totalCredits}</div>
            <div className="text-[10px] text-[#b0b3b8] mt-0.5">Kỳ này: {currentSemester?.courses.reduce((s, c) => s + c.credits, 0) || 0} tín chỉ</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#18191a] border border-[#393a3b]">
            <div className="text-[11px] text-[#b0b3b8]">Tổng Số Môn Học</div>
            <div className="text-2xl sm:text-3xl font-black text-[#f7b125] mt-1">
              {study.semesters.reduce((acc, s) => acc + s.courses.length, 0)}
            </div>
            <div className="text-[10px] text-[#b0b3b8] mt-0.5">Kỳ này: {currentSemester?.courses.length || 0} môn</div>
          </div>
        </div>

        {/* Target Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-[#b0b3b8]">
            <span>Tiến độ đạt mục tiêu CPA ({cumulativeCpa} / {study.targetCpa})</span>
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

      {/* 2. Course & Semester Grade Table */}
      <div className="bg-[#242526] rounded-xl p-5 border border-[#393a3b] shadow-sm space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1877f2]" />
            <h3 className="font-bold text-[#e4e6eb] text-base">Bảng Điểm Môn Học</h3>

            {/* Semester selector dropdown */}
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
            >
              {study.semesters.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (GPA: {s.gpa4})
                </option>
              ))}
            </select>

            {/* Semester management buttons */}
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowAddSemester(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#4e4f50] text-[#e4e6eb] text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Thêm học kỳ mới"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#1877f2]" />
                  <span className="hidden sm:inline">Thêm Kỳ</span>
                </button>
                {study.semesters.length > 1 && (
                  <button
                    onClick={() => handleDeleteSemester(selectedSemesterId)}
                    className="p-1.5 rounded-lg bg-[#3a3b3c] hover:bg-[#e41e3f]/20 hover:text-[#e41e3f] text-[#b0b3b8] transition-colors"
                    title="Xóa học kỳ hiện tại"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddCourse(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-sm transition-all"
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
                <th className="py-3 px-3">Mã Môn</th>
                <th className="py-3 px-3">Tên Môn Học</th>
                <th className="py-3 px-3 text-center">Tín Chỉ</th>
                <th className="py-3 px-3 text-center">Điểm QT (30%)</th>
                <th className="py-3 px-3 text-center">Điểm Thi (70%)</th>
                <th className="py-3 px-3 text-center">Hệ 10</th>
                <th className="py-3 px-3 text-center">Hệ 4</th>
                <th className="py-3 px-3 text-center">Điểm Chữ</th>
                {isAdmin && <th className="py-3 px-3 text-right">Thao Tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#393a3b]/60">
              {currentSemester?.courses.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-8 text-center text-xs text-[#b0b3b8]">
                    Học kỳ này chưa có môn học nào. Hãy bấm "Thêm Môn Học Mới" để nhập điểm!
                  </td>
                </tr>
              ) : (
                currentSemester?.courses.map(c => (
                  <tr key={c.id} className="hover:bg-[#3a3b3c]/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-[#1877f2] font-bold">{c.code}</td>
                    <td className="py-3 px-3 font-medium text-[#e4e6eb]">{c.name}</td>
                    <td className="py-3 px-3 text-center font-mono text-[#b0b3b8]">{c.credits}</td>
                    <td className="py-3 px-3 text-center font-mono text-[#e4e6eb]">{c.scoreProcess ?? '-'}</td>
                    <td className="py-3 px-3 text-center font-mono text-[#e4e6eb]">{c.scoreExam ?? '-'}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#e4e6eb]">{c.score10}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#31a24c]">{c.score4}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#3a3b3c] text-[#e4e6eb] font-bold font-mono text-[11px] border border-[#393a3b]">
                        {c.letterGrade}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingCourse(c)}
                            className="p-1.5 rounded-lg text-[#b0b3b8] hover:text-[#1877f2] hover:bg-[#3a3b3c] transition-colors"
                            title="Chỉnh sửa điểm môn học"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-1.5 rounded-lg text-[#b0b3b8] hover:text-[#e41e3f] hover:bg-[#3a3b3c] transition-colors"
                            title="Xóa môn học này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Thêm Môn Học Mới */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddCourseSubmit} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1877f2]" />
              <span>Thêm Môn Học Vào {currentSemester?.name}</span>
            </h4>
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
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Điểm Quá Trình (30%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCourse.scoreProcess}
                  onChange={(e) => setNewCourse({ ...newCourse, scoreProcess: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Điểm Thi Cuối Kỳ (70%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCourse.scoreExam}
                  onChange={(e) => setNewCourse({ ...newCourse, scoreExam: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
            </div>

            {/* Calculated Grade Preview */}
            {(() => {
              const preview = calculateGrade(
                Number(newCourse.scoreProcess) || 0,
                Number(newCourse.scoreExam) || 0
              );
              return (
                <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b] text-xs flex justify-between">
                  <span>Hệ 10: <strong className="text-[#1877f2]">{preview.final10}</strong></span>
                  <span>Hệ 4: <strong className="text-[#31a24c]">{preview.g4}</strong></span>
                  <span>Điểm Chữ: <strong className="text-[#e4e6eb]">{preview.letter}</strong></span>
                </div>
              );
            })()}

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

      {/* MODAL: Chỉnh Sửa Môn Học & Điểm Số */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSaveEditCourse} className="bg-[#242526] p-6 rounded-xl max-w-md w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#1877f2]" />
              <span>Chỉnh Sửa Điểm & Môn Học</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Mã Môn</label>
                <input
                  type="text"
                  value={editingCourse.code}
                  onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Số Tín Chỉ</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editingCourse.credits}
                  onChange={(e) => setEditingCourse({ ...editingCourse, credits: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Môn Học</label>
                <input
                  type="text"
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Điểm Quá Trình (30%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editingCourse.scoreProcess}
                  onChange={(e) => setEditingCourse({ ...editingCourse, scoreProcess: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Điểm Thi Cuối Kỳ (70%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editingCourse.scoreExam}
                  onChange={(e) => setEditingCourse({ ...editingCourse, scoreExam: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                />
              </div>
            </div>

            {/* Calculated Grade Preview */}
            {(() => {
              const preview = calculateGrade(
                Number(editingCourse.scoreProcess) || 0,
                Number(editingCourse.scoreExam) || 0
              );
              return (
                <div className="p-3 rounded-lg bg-[#18191a] border border-[#393a3b] text-xs flex justify-between">
                  <span>Hệ 10: <strong className="text-[#1877f2]">{preview.final10}</strong></span>
                  <span>Hệ 4: <strong className="text-[#31a24c]">{preview.g4}</strong></span>
                  <span>Điểm Chữ: <strong className="text-[#e4e6eb]">{preview.letter}</strong></span>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Thêm Học Kỳ Mới */}
      {showAddSemester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddSemester} className="bg-[#242526] p-6 rounded-xl max-w-sm w-full border border-[#393a3b] shadow-2xl space-y-4">
            <h4 className="font-bold text-[#e4e6eb] text-base flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-[#1877f2]" />
              <span>Thêm Học Kỳ Mới</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#b0b3b8] mb-1 font-semibold">Tên Học Kỳ</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Kỳ 2 (2025-2026)"
                  value={newSemesterName}
                  onChange={(e) => setNewSemesterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#3a3b3c] border border-[#393a3b] text-[#e4e6eb] placeholder-[#b0b3b8] focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSemester(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#b0b3b8] hover:bg-[#3a3b3c] hover:text-[#e4e6eb] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors"
              >
                Tạo Học Kỳ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

