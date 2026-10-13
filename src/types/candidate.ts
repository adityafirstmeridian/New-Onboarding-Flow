export type CandidateType = 'fresher' | 'experienced';
export type FresherStatus = 'passed_out' | 'still_pursuing';
export type HighestQualification = 'UG' | 'PG' | 'Diploma' | '12th' | '10th' | 'ITI';
export type ScoreType = 'percentage' | 'cgpa';

export interface CandidateFormData {
  // Question 1 (At the very beginning)
  candidateType: CandidateType;

  // Personal Info (Required for all)
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  preferredLocation: string;
  designation: string; // Required for experienced

  // Fresher conditional details
  fresherStatus: FresherStatus;

  // Educational Fields
  highestQualification: HighestQualification;

  // For UG, PG, Diploma
  degree: string;
  department: string;

  // For 12th
  twelfthStream: string;

  // For ITI
  itiTrade: string;

  // For 10th & 12th
  board: string;
  otherBoardName?: string;

  // School / College / Institute name
  collegeName: string; // Used as School name for 10th/12th, or College/Polytechnic/ITI name

  // Marks in CGPA or Percentage
  scoreType: ScoreType;
  scoreValue: string;
  gradeScore: string; // Formatted score e.g. "91.4%" or "9.2 CGPA"

  // If Passed Out
  passingYear: string;
  immediateJoining: boolean;

  // If Still Pursuing (UG, PG, Diploma, ITI)
  currentYearSemester: string;
  expectedGraduation: string;

  // If Still Pursuing (10th / 12th)
  expectedPassingYear?: string;
}

export interface CandidateRecord extends CandidateFormData {
  id: string;
  submittedAt: string;
  status: 'submitted' | 'approved' | 'under_review';
}

export const INITIAL_FORM_DATA: CandidateFormData = {
  candidateType: 'fresher',

  fullName: '',
  phone: '',
  email: '',
  dob: '',
  gender: 'Female',
  preferredLocation: '',
  designation: '',

  fresherStatus: 'passed_out',

  highestQualification: 'UG',
  degree: 'B.Tech / B.E (Engineering)',
  department: 'Computer Science & Engineering',
  twelfthStream: 'Science (PCM - Physics, Chemistry, Maths)',
  itiTrade: 'ITI Electrician',
  board: 'CBSE',
  collegeName: '',

  scoreType: 'percentage',
  scoreValue: '',
  gradeScore: '',

  passingYear: '2025',
  immediateJoining: true,

  currentYearSemester: 'Final Year (8th Semester)',
  expectedGraduation: '2026-06',
  expectedPassingYear: '2026',
};

export const SAMPLE_EXPERIENCED: CandidateFormData = {
  candidateType: 'experienced',
  fullName: 'Vikram Malhotra',
  phone: '+91 99201 54321',
  email: 'vikram.malhotra@techcorp.io',
  dob: '1998-05-14',
  gender: 'Male',
  preferredLocation: 'Bengaluru / Hybrid',
  designation: 'Senior Software Engineer',

  fresherStatus: 'passed_out',
  highestQualification: 'UG',
  degree: '',
  department: '',
  twelfthStream: '',
  itiTrade: '',
  board: '',
  collegeName: '',
  scoreType: 'percentage',
  scoreValue: '',
  gradeScore: '',
  passingYear: '',
  immediateJoining: false,
  currentYearSemester: '',
  expectedGraduation: '',
  expectedPassingYear: '',
};

export const SAMPLE_FRESHER_PASSED_OUT: CandidateFormData = {
  candidateType: 'fresher',
  fullName: 'Aarav Sharma',
  phone: '+91 98765 43210',
  email: 'aarav.sharma@example.com',
  dob: '2003-08-21',
  gender: 'Male',
  preferredLocation: 'Bengaluru / Pune',
  designation: '',

  fresherStatus: 'passed_out',
  highestQualification: 'UG',
  degree: 'B.Tech / B.E (Engineering)',
  department: 'Computer Science & Engineering',
  twelfthStream: '',
  itiTrade: '',
  board: '',
  collegeName: 'National Institute of Technology, Karnataka',
  scoreType: 'cgpa',
  scoreValue: '8.7',
  gradeScore: '8.7 CGPA',
  passingYear: '2025',
  immediateJoining: true,

  currentYearSemester: 'Graduated',
  expectedGraduation: '2025-06',
  expectedPassingYear: '2025',
};

export const SAMPLE_FRESHER_12TH: CandidateFormData = {
  candidateType: 'fresher',
  fullName: 'Rohan Mehra',
  phone: '+91 98234 11223',
  email: 'rohan.mehra@example.com',
  dob: '2006-03-15',
  gender: 'Male',
  preferredLocation: 'Delhi / NCR',
  designation: '',

  fresherStatus: 'passed_out',
  highestQualification: '12th',
  degree: '',
  department: '',
  twelfthStream: 'Science (PCM - Physics, Chemistry, Maths)',
  itiTrade: '',
  board: 'CBSE',
  collegeName: 'Delhi Public School, R.K. Puram',
  scoreType: 'percentage',
  scoreValue: '91.4',
  gradeScore: '91.4%',
  passingYear: '2024',
  immediateJoining: true,

  currentYearSemester: '',
  expectedGraduation: '',
  expectedPassingYear: '2024',
};

export const SAMPLE_FRESHER_10TH: CandidateFormData = {
  candidateType: 'fresher',
  fullName: 'Sneha Deshmukh',
  phone: '+91 97654 32190',
  email: 'sneha.deshmukh@example.com',
  dob: '2007-09-10',
  gender: 'Female',
  preferredLocation: 'Mumbai',
  designation: '',

  fresherStatus: 'passed_out',
  highestQualification: '10th',
  degree: '',
  department: '',
  twelfthStream: '',
  itiTrade: '',
  board: 'ICSE',
  collegeName: 'St. Xavier’s High School, Fort Mumbai',
  scoreType: 'cgpa',
  scoreValue: '9.4',
  gradeScore: '9.4 CGPA',
  passingYear: '2023',
  immediateJoining: true,

  currentYearSemester: '',
  expectedGraduation: '',
  expectedPassingYear: '2023',
};

export const SAMPLE_FRESHER_PURSUING: CandidateFormData = {
  candidateType: 'fresher',
  fullName: 'Priya Patel',
  phone: '+91 98112 34567',
  email: 'priya.patel@student.edu',
  dob: '2004-11-09',
  gender: 'Female',
  preferredLocation: 'Remote / Pune',
  designation: '',

  fresherStatus: 'still_pursuing',
  highestQualification: 'UG',
  degree: 'B.Tech / B.E (Engineering)',
  department: 'Information Technology',
  twelfthStream: '',
  itiTrade: '',
  board: '',
  collegeName: 'College of Engineering, Pune',
  scoreType: 'cgpa',
  scoreValue: '9.1',
  gradeScore: '9.1 CGPA',
  passingYear: '2027',
  immediateJoining: false,

  currentYearSemester: '3rd Year (6th Semester)',
  expectedGraduation: '2027-05',
  expectedPassingYear: '2027',
};
