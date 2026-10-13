import {
  CandidateFormData,
  CandidateRecord,
  SAMPLE_EXPERIENCED,
  SAMPLE_FRESHER_PASSED_OUT,
  SAMPLE_FRESHER_12TH,
  SAMPLE_FRESHER_PURSUING,
} from '../types/candidate';

const STORAGE_KEY = 'onboardflow_candidates_records';

export const getStoredCandidates = (): CandidateRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialSeed: CandidateRecord[] = [
        {
          ...SAMPLE_FRESHER_PASSED_OUT,
          id: 'CND-2026-101',
          submittedAt: '2026-10-12T14:20:00.000Z',
          status: 'approved',
        },
        {
          ...SAMPLE_FRESHER_12TH,
          id: 'CND-2026-102',
          submittedAt: '2026-10-12T16:45:00.000Z',
          status: 'approved',
        },
        {
          ...SAMPLE_FRESHER_PURSUING,
          id: 'CND-2026-103',
          submittedAt: '2026-10-13T09:15:00.000Z',
          status: 'under_review',
        },
        {
          ...SAMPLE_EXPERIENCED,
          id: 'CND-2026-104',
          submittedAt: '2026-10-13T10:45:00.000Z',
          status: 'submitted',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load candidate records from localStorage:', err);
    return [];
  }
};

export const saveNewCandidate = (data: CandidateFormData): CandidateRecord => {
  const existing = getStoredCandidates();
  const newRecord: CandidateRecord = {
    ...data,
    id: `CND-2026-${String(Math.floor(100 + Math.random() * 900))}`,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
  };
  const updated = [newRecord, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save candidate to localStorage:', err);
  }
  return newRecord;
};

export const deleteCandidate = (id: string): CandidateRecord[] => {
  const existing = getStoredCandidates();
  const updated = existing.filter((c) => c.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to remove candidate:', err);
  }
  return updated;
};

export const resetToDefaultSeed = (): CandidateRecord[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset storage:', err);
  }
  return getStoredCandidates();
};

export const exportCandidatesAsCSV = (candidates: CandidateRecord[]) => {
  if (!candidates.length) return;

  const headers = [
    'Candidate ID',
    'Classification',
    'Full Name',
    'Gender',
    'Phone',
    'Email',
    'DOB',
    'Preferred Location',
    'Designation',
    'Academic Status (if Fresher)',
    'Highest Qualification',
    'Stream / Degree / Trade',
    'Department / Branch',
    'Education Board (if 10/12)',
    'School / College / Institute',
    'Passing Year / Completion',
    'Marks (CGPA or %)',
    'Submission Date',
  ];

  const rows = candidates.map((c) => {
    const isFresher = c.candidateType === 'fresher';
    const isPassed = c.fresherStatus === 'passed_out';
    const isTenthOrTwelfth = c.highestQualification === '10th' || c.highestQualification === '12th';

    const streamOrDegree = isFresher
      ? c.highestQualification === '10th'
        ? 'Secondary (10th)'
        : c.highestQualification === '12th'
        ? c.twelfthStream
        : c.highestQualification === 'ITI'
        ? c.itiTrade
        : c.degree
      : 'N/A';

    return [
      `"${c.id}"`,
      `"${c.candidateType}"`,
      `"${c.fullName}"`,
      `"${c.gender}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.dob}"`,
      `"${c.preferredLocation}"`,
      `"${c.designation || 'N/A'}"`,
      `"${isFresher ? (isPassed ? 'Passed Out' : 'Still Pursuing') : 'N/A'}"`,
      `"${isFresher ? c.highestQualification : 'N/A'}"`,
      `"${streamOrDegree}"`,
      `"${isFresher && !isTenthOrTwelfth ? c.department || 'N/A' : 'N/A'}"`,
      `"${isFresher && isTenthOrTwelfth ? c.board : 'N/A'}"`,
      `"${isFresher ? c.collegeName : 'N/A'}"`,
      `"${
        isFresher
          ? isPassed
            ? c.passingYear
            : c.expectedPassingYear || c.expectedGraduation
          : 'N/A'
      }"`,
      `"${isFresher && isPassed ? c.gradeScore || c.scoreValue : 'N/A'}"`,
      `"${new Date(c.submittedAt).toLocaleDateString()}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `candidates_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportSingleCandidateJSON = (candidate: CandidateRecord) => {
  const jsonContent = JSON.stringify(candidate, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${candidate.id}_${candidate.fullName.replace(/\s+/g, '_')}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
