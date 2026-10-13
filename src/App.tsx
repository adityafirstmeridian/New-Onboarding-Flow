import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { OnboardingForm } from './components/OnboardingForm';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { HRDashboard } from './components/HRDashboard';
import {
  CandidateFormData,
  CandidateRecord,
  INITIAL_FORM_DATA,
} from './types/candidate';
import { getStoredCandidates, saveNewCandidate } from './utils/storage';

export default function App() {
  const [activeView, setActiveView] = useState<'form' | 'hr'>('form');
  const [formData, setFormData] = useState<CandidateFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState<CandidateRecord | null>(null);
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);

  // Load candidate records from storage
  useEffect(() => {
    setCandidates(getStoredCandidates());
  }, []);

  const updateField = <K extends keyof CandidateFormData>(
    key: K,
    value: CandidateFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Essential Personal Fields (Required for all)
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';
    if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
    if (!formData.preferredLocation.trim())
      newErrors.preferredLocation = 'Preferred location is required';

    // 2. If Experienced: Designation is required
    if (formData.candidateType === 'experienced') {
      if (!formData.designation.trim()) {
        newErrors.designation = 'Designation is required';
      }
    }

    // 3. If Fresher: Educational branch validation
    if (formData.candidateType === 'fresher') {
      const qual = formData.highestQualification;
      const isPassed = formData.fresherStatus === 'passed_out';

      if (qual === '10th') {
        if (!formData.board.trim()) newErrors.board = '10th Board is required';
        if (!formData.collegeName.trim())
          newErrors.collegeName = 'School name is required';
        if (isPassed) {
          if (!formData.passingYear.trim())
            newErrors.passingYear = 'Passing year is required';
          if (!formData.scoreValue.trim())
            newErrors.scoreValue = 'Marks (CGPA or %) is required';
        }
      } else if (qual === '12th') {
        if (!formData.twelfthStream.trim())
          newErrors.twelfthStream = '12th Stream is required';
        if (!formData.board.trim()) newErrors.board = '12th Board is required';
        if (!formData.collegeName.trim())
          newErrors.collegeName = 'School / Junior college name is required';
        if (isPassed) {
          if (!formData.passingYear.trim())
            newErrors.passingYear = 'Passing year is required';
          if (!formData.scoreValue.trim())
            newErrors.scoreValue = 'Marks (CGPA or %) is required';
        }
      } else if (qual === 'ITI') {
        if (!formData.collegeName.trim())
          newErrors.collegeName = 'ITI Institute name is required';
        if (isPassed) {
          if (!formData.passingYear.trim())
            newErrors.passingYear = 'Passing year is required';
        } else {
          if (!formData.expectedGraduation.trim())
            newErrors.expectedGraduation = 'Expected completion date is required';
        }
      } else if (qual === 'Diploma') {
        if (!formData.department.trim())
          newErrors.department = 'Department is required';
        if (!formData.collegeName.trim())
          newErrors.collegeName = 'Polytechnic name is required';
        if (isPassed) {
          if (!formData.passingYear.trim())
            newErrors.passingYear = 'Passing year is required';
        } else {
          if (!formData.expectedGraduation.trim())
            newErrors.expectedGraduation = 'Expected completion date is required';
        }
      } else {
        // UG or PG
        if (!formData.department.trim())
          newErrors.department = 'Department is required';
        if (!formData.collegeName.trim())
          newErrors.collegeName = 'College / University name is required';
        if (isPassed) {
          if (!formData.passingYear.trim())
            newErrors.passingYear = 'Passing year is required';
        } else {
          if (!formData.expectedGraduation.trim())
            newErrors.expectedGraduation = 'Expected graduation date is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Ensure gradeScore is populated if scoreValue is present
      const submissionData = {
        ...formData,
        gradeScore:
          formData.scoreValue && !formData.gradeScore
            ? formData.scoreType === 'percentage'
              ? `${formData.scoreValue}%`
              : `${formData.scoreValue} CGPA`
            : formData.gradeScore,
      };
      const record = saveNewCandidate(submissionData);
      setCandidates((prev) => [record, ...prev]);
      setSubmittedCandidate(record);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmittedCandidate(null);
  };

  const handleApplyPreset = (preset: CandidateFormData) => {
    setFormData(preset);
    setErrors({});
    setSubmittedCandidate(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <TopNav
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          if (view === 'form') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        candidateCount={candidates.length}
        onApplyPreset={handleApplyPreset}
        onResetForm={handleReset}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeView === 'hr' ? (
          <HRDashboard
            candidates={candidates}
            setCandidates={setCandidates}
            onNewCandidateClick={() => {
              handleReset();
              setActiveView('form');
            }}
          />
        ) : submittedCandidate ? (
          <SubmissionSuccess
            candidate={submittedCandidate}
            onReset={handleReset}
            onViewHR={() => setActiveView('hr')}
          />
        ) : (
          <div>
            {/* Header Title */}
            <div className="mb-6 text-center max-w-lg mx-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Candidate Onboarding Form
              </h1>
            </div>

            {/* Single Step Onboarding Form */}
            <OnboardingForm
              formData={formData}
              updateField={updateField}
              onSubmit={handleSubmit}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">OnboardFlow</span>
            <span>·</span>
            <span>Candidate Intake Portal</span>
          </div>
          <div className="text-slate-400">
            <span>Simple 1-Step Onboarding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
