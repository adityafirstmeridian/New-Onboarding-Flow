import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Trash2,
  Eye,
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
  Mail,
  Phone,
  X,
  RotateCcw,
  Award,
  BookOpen,
} from 'lucide-react';
import { CandidateRecord } from '../types/candidate';
import {
  exportCandidatesAsCSV,
  exportSingleCandidateJSON,
  deleteCandidate,
  resetToDefaultSeed,
} from '../utils/storage';

interface HRDashboardProps {
  candidates: CandidateRecord[];
  setCandidates: React.Dispatch<React.SetStateAction<CandidateRecord[]>>;
  onNewCandidateClick: () => void;
}

type FilterType = 'all' | 'fresher_passed' | 'fresher_pursuing' | 'experienced';

export const HRDashboard: React.FC<HRDashboardProps> = ({
  candidates,
  setCandidates,
  onNewCandidateClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        c.fullName.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.designation.toLowerCase().includes(query) ||
        c.preferredLocation.toLowerCase().includes(query) ||
        (c.highestQualification && c.highestQualification.toLowerCase().includes(query)) ||
        (c.board && c.board.toLowerCase().includes(query)) ||
        (c.twelfthStream && c.twelfthStream.toLowerCase().includes(query)) ||
        (c.collegeName && c.collegeName.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (activeFilter === 'fresher_passed') {
        return c.candidateType === 'fresher' && c.fresherStatus === 'passed_out';
      }
      if (activeFilter === 'fresher_pursuing') {
        return c.candidateType === 'fresher' && c.fresherStatus === 'still_pursuing';
      }
      if (activeFilter === 'experienced') {
        return c.candidateType === 'experienced';
      }
      return true;
    });
  }, [candidates, searchTerm, activeFilter]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this candidate record?')) {
      const updated = deleteCandidate(id);
      setCandidates(updated);
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(null);
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset candidate records to initial sample data?')) {
      const seeded = resetToDefaultSeed();
      setCandidates(seeded);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Candidate Intake & HR Records
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Single-table management for fresher and experienced submissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportCandidatesAsCSV(filteredCandidates)}
            disabled={filteredCandidates.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onNewCandidateClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <span>+ New Onboarding</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, designation, location..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('fresher_passed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'fresher_passed'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fresher (Passed Out)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('fresher_pursuing')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'fresher_pursuing'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fresher (Pursuing)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('experienced')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === 'experienced'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Experienced
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Data Grid */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No candidates found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filter selection.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Records</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Candidate ID</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Contact (Phone / Email)</th>
                  <th className="py-3 px-4">DOB</th>
                  <th className="py-3 px-4">Preferred Location</th>
                  <th className="py-3 px-4">Academics (if Fresher)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((c) => {
                  const isFresher = c.candidateType === 'fresher';
                  const isPassedOut = c.fresherStatus === 'passed_out';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700 tabular-nums">
                        {c.id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {c.fullName}
                        </div>
                        {c.designation && <div className="text-slate-500 text-[11px]">{c.designation}</div>}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        {isFresher ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isPassedOut ? 'bg-emerald-500' : 'bg-sky-500'
                              }`}
                            />
                            <span className="font-medium text-slate-800">
                              {isPassedOut ? 'Fresher (Passed Out)' : 'Fresher (Pursuing)'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="font-medium text-slate-800">Experienced Hire</span>
                          </div>
                        )}
                      </td>

                      {/* Contact & Gender */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{c.phone}</div>
                        <div className="text-slate-400 text-[11px] truncate max-w-[140px]">
                          {c.email} · {c.gender}
                        </div>
                      </td>

                      {/* DOB */}
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                        {c.dob}
                      </td>

                      {/* Preferred Location */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {c.preferredLocation}
                      </td>

                      {/* Academics (if fresher) */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {isFresher ? (
                          <div>
                            <span className="font-medium text-slate-800">
                              {c.highestQualification === '10th' ? (
                                `10th Standard · ${c.board || 'Board'}`
                              ) : c.highestQualification === '12th' ? (
                                `12th · ${c.twelfthStream || 'Stream'}`
                              ) : c.highestQualification === 'ITI' ? (
                                `ITI · ${c.itiTrade || 'Trade'}`
                              ) : (
                                `${c.highestQualification} · ${c.degree}`
                              )}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                              {c.highestQualification === '10th' || c.highestQualification === '12th' ? (
                                `${c.collegeName} (${
                                  isPassedOut ? c.passingYear : c.expectedPassingYear || 'Pursuing'
                                })${c.gradeScore ? ` · ${c.gradeScore}` : ''}`
                              ) : (
                                `${c.department ? `${c.department} · ` : ''}${c.collegeName} (${
                                  isPassedOut ? c.passingYear : c.currentYearSemester
                                })${c.gradeScore ? ` · ${c.gradeScore}` : ''}`
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCandidate(c);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportSingleCandidateJSON(c);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Download JSON record"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(c.id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DOSSIER MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {selectedCandidate.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCandidate.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block mb-0.5">Classification</span>
                  <span className="font-semibold text-slate-800 text-sm capitalize">
                    {selectedCandidate.candidateType === 'fresher'
                      ? selectedCandidate.fresherStatus === 'passed_out'
                        ? 'Fresher (Passed Out)'
                        : 'Fresher (Still Pursuing)'
                      : 'Experienced Candidate'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Gender</span>
                  <span className="font-semibold text-slate-800 text-sm">
                    {selectedCandidate.gender}
                  </span>
                </div>
                {selectedCandidate.designation ? (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Designation</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {selectedCandidate.designation}
                    </span>
                  </div>
                ) : null}
                <div>
                  <span className="text-slate-400 block mb-0.5">Full Name</span>
                  <span className="font-medium text-slate-800">{selectedCandidate.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone Number</span>
                  <span className="font-medium text-slate-800">{selectedCandidate.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address</span>
                  <span className="font-medium text-slate-800 break-all">{selectedCandidate.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Birth (DOB)</span>
                  <span className="font-medium text-slate-800 font-mono tabular-nums">
                    {selectedCandidate.dob}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-0.5">Preferred Location</span>
                  <span className="font-medium text-slate-800">
                    {selectedCandidate.preferredLocation}
                  </span>
                </div>
              </div>

              {/* Fresher Specific Academic Dossier */}
              {selectedCandidate.candidateType === 'fresher' && (
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">
                    {selectedCandidate.fresherStatus === 'passed_out'
                      ? 'Academic & Educational Details'
                      : 'Enrollment & Academic Stage'}
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Highest Qualification</span>
                      <span className="font-semibold text-slate-800">
                        {selectedCandidate.highestQualification}
                      </span>
                    </div>

                    {/* For 10th */}
                    {selectedCandidate.highestQualification === '10th' && (
                      <>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Education Board</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.board || '—'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block mb-0.5">School Name</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.collegeName}
                          </span>
                        </div>
                      </>
                    )}

                    {/* For 12th */}
                    {selectedCandidate.highestQualification === '12th' && (
                      <>
                        <div>
                          <span className="text-slate-400 block mb-0.5">12th Stream</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.twelfthStream || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Education Board</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.board || '—'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block mb-0.5">School / Junior College</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.collegeName}
                          </span>
                        </div>
                      </>
                    )}

                    {/* For ITI */}
                    {selectedCandidate.highestQualification === 'ITI' && (
                      <>
                        <div>
                          <span className="text-slate-400 block mb-0.5">ITI Trade</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.itiTrade || '—'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block mb-0.5">ITI Institute</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.collegeName}
                          </span>
                        </div>
                      </>
                    )}

                    {/* For UG / PG / Diploma */}
                    {selectedCandidate.highestQualification !== '10th' &&
                      selectedCandidate.highestQualification !== '12th' &&
                      selectedCandidate.highestQualification !== 'ITI' && (
                        <>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Degree / Course</span>
                            <span className="font-medium text-slate-800">{selectedCandidate.degree}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Department / Branch</span>
                            <span className="font-medium text-slate-800">{selectedCandidate.department}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block mb-0.5">College / University</span>
                            <span className="font-medium text-slate-800">
                              {selectedCandidate.collegeName}
                            </span>
                          </div>
                        </>
                      )}

                    {/* Passing Year / Graduation */}
                    <div>
                      <span className="text-slate-400 block mb-0.5">
                        {selectedCandidate.fresherStatus === 'passed_out'
                          ? 'Year of Passing'
                          : 'Expected Completion'}
                      </span>
                      <span className="font-medium text-slate-800 font-mono">
                        {selectedCandidate.fresherStatus === 'passed_out'
                          ? selectedCandidate.passingYear
                          : selectedCandidate.expectedPassingYear || selectedCandidate.expectedGraduation}
                      </span>
                    </div>

                    {/* Marks / CGPA */}
                    {selectedCandidate.fresherStatus === 'passed_out' && (
                      <div>
                        <span className="text-slate-400 block mb-0.5">Marks in CGPA / %</span>
                        <span className="font-medium text-indigo-700 font-mono">
                          {selectedCandidate.gradeScore || '—'}
                        </span>
                      </div>
                    )}

                    {selectedCandidate.fresherStatus === 'still_pursuing' &&
                      selectedCandidate.highestQualification !== '10th' &&
                      selectedCandidate.highestQualification !== '12th' && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block mb-0.5">Current Stage</span>
                          <span className="font-medium text-slate-800">
                            {selectedCandidate.currentYearSemester}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-3.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => exportSingleCandidateJSON(selectedCandidate)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
