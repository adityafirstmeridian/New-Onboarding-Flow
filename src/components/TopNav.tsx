import React, { useState } from 'react';
import { Briefcase, Users, FileText, Sparkles, RotateCcw } from 'lucide-react';
import {
  CandidateFormData,
  SAMPLE_EXPERIENCED,
  SAMPLE_FRESHER_PASSED_OUT,
  SAMPLE_FRESHER_12TH,
  SAMPLE_FRESHER_10TH,
  SAMPLE_FRESHER_PURSUING,
} from '../types/candidate';

interface TopNavProps {
  activeView: 'form' | 'hr';
  setActiveView: (view: 'form' | 'hr') => void;
  candidateCount: number;
  onApplyPreset: (data: CandidateFormData) => void;
  onResetForm: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  setActiveView,
  candidateCount,
  onApplyPreset,
  onResetForm,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                OnboardFlow
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Candidate Intake Portal
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveView('form')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'form'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Candidate Form</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('hr')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'hr'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>HR Submissions</span>
              <span className="ml-1 text-xs font-mono tabular-nums bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                {candidateCount}
              </span>
            </button>
          </nav>

          {/* Zone 3: Actions & Demo Presets */}
          <div className="flex items-center gap-2 shrink-0">
            {activeView === 'form' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors whitespace-nowrap"
                  title="Quickly fill form with realistic test data"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Fill Sample Data</span>
                  <span className="md:hidden">Sample</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40 text-left">
                    <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Load Preset Sample
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPreset(SAMPLE_FRESHER_PASSED_OUT);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="font-medium text-slate-900">Fresher (UG - B.Tech)</div>
                      <div className="text-[11px] text-slate-500">Degree, Dept, NITK · 8.7 CGPA</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPreset(SAMPLE_FRESHER_12TH);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="font-medium text-slate-900">Fresher (12th Passed)</div>
                      <div className="text-[11px] text-slate-500">PCM · CBSE · DPS · 91.4%</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPreset(SAMPLE_FRESHER_10TH);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="font-medium text-slate-900">Fresher (10th Passed)</div>
                      <div className="text-[11px] text-slate-500">ICSE · St. Xavier's · 9.4 CGPA</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPreset(SAMPLE_FRESHER_PURSUING);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="font-medium text-slate-900">Fresher (Still Pursuing)</div>
                      <div className="text-[11px] text-slate-500">UG B.Tech · 3rd Year</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPreset(SAMPLE_EXPERIENCED);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-xs rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="font-medium text-slate-900">Experienced Professional</div>
                      <div className="text-[11px] text-slate-500">No academics · Senior Engineer</div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeView === 'form' && (
              <button
                type="button"
                onClick={onResetForm}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Reset form fields"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
