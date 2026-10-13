import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building,
  Award,
  BookOpen,
  CheckCircle2,
  Send,
  Users,
  Percent,
} from 'lucide-react';
import { CandidateFormData, HighestQualification } from '../types/candidate';

interface OnboardingFormProps {
  formData: CandidateFormData;
  updateField: <K extends keyof CandidateFormData>(key: K, value: CandidateFormData[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const GENDERS = ['Female', 'Male', 'Non-binary / Other', 'Prefer not to say'];

const BOARDS = [
  'CBSE',
  'ICSE',
  'State Board',
  'NIOS',
  'CISCE',
  'International Baccalaureate (IB)',
  'Cambridge (IGCSE)',
  'Other Board',
];

const TWELFTH_STREAMS = [
  'Science (PCM - Physics, Chemistry, Maths)',
  'Science (PCB - Physics, Chemistry, Biology)',
  'Science (PCMB - Math & Biology)',
  'Commerce (with Maths)',
  'Commerce (without Maths)',
  'Arts / Humanities',
  'Vocational Stream',
  'Other Stream',
];

const ITI_TRADES = [
  'ITI Electrician',
  'ITI Fitter',
  'ITI Machinist',
  'ITI COPA (Computer Operator & Programming Assistant)',
  'ITI Welder',
  'ITI Turner',
  'ITI Mechanic Motor Vehicle',
  'ITI Electronic Mechanic',
  'Other ITI Trade',
];

const QUALIFICATIONS: { id: HighestQualification; label: string; desc: string }[] = [
  { id: 'UG', label: 'UG', desc: 'B.Tech, BCA, B.Sc, B.Com, etc.' },
  { id: 'PG', label: 'PG', desc: 'M.Tech, MCA, MBA, M.Sc, etc.' },
  { id: 'Diploma', label: 'Diploma', desc: 'Polytechnic, Technical' },
  { id: '12th', label: '12th', desc: 'Higher Secondary / +2' },
  { id: '10th', label: '10th', desc: 'Secondary / SSC' },
  { id: 'ITI', label: 'ITI', desc: 'Industrial Training' },
];

const DEGREES_BY_QUALIFICATION: Record<HighestQualification, string[]> = {
  UG: [
    'B.Tech / B.E (Engineering)',
    'BCA (Computer Applications)',
    'B.Sc (Computer Science / IT / General)',
    'B.Com (Commerce)',
    'BBA / BMS (Business Administration)',
    'BA (Bachelor of Arts)',
    'B.Des (Design)',
    'B.Pharm',
    'Other UG Degree',
  ],
  PG: [
    'M.Tech / M.E (Engineering)',
    'MCA (Master of Computer Apps)',
    'M.Sc (Computer Science / IT / Science)',
    'MBA / PGDM (Management)',
    'M.Com (Commerce)',
    'MA (Master of Arts)',
    'MS (Master of Science)',
    'Other PG Degree',
  ],
  Diploma: [
    'Polytechnic Diploma in Computer Engineering',
    'Diploma in Information Technology',
    'Diploma in Mechanical Engineering',
    'Diploma in Electrical Engineering',
    'Diploma in Civil Engineering',
    'Diploma in Electronics & Telecomm',
    'Other Diploma',
  ],
  '12th': [],
  '10th': [],
  ITI: [],
};

const PASSING_YEARS = [
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
];

const EXPECTED_PURSUING_YEARS = ['2026', '2027', '2028', '2029', '2030'];

const HIGHER_ED_STAGES = [
  'Final Year (8th Semester)',
  'Final Year (7th Semester)',
  '3rd Year (6th Semester)',
  '3rd Year (5th Semester)',
  '2nd Year (4th Semester)',
  '2nd Year (3rd Semester)',
  '1st Year',
];

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  formData,
  updateField,
  onSubmit,
  errors,
  isSubmitting,
}) => {
  const isFresher = formData.candidateType === 'fresher';
  const isPassedOut = formData.fresherStatus === 'passed_out';
  const qual = formData.highestQualification;

  const isTenthOrTwelfth = qual === '10th' || qual === '12th';
  const isTenth = qual === '10th';
  const isTwelfth = qual === '12th';
  const isITI = qual === 'ITI';
  const isDiploma = qual === 'Diploma';
  const isDegreeBased = qual === 'UG' || qual === 'PG';

  const currentDegrees = DEGREES_BY_QUALIFICATION[qual] || [];

  const handleQualificationChange = (newQual: HighestQualification) => {
    updateField('highestQualification', newQual);
    if (newQual === '10th' || newQual === '12th') {
      updateField('degree', '');
      updateField('department', '');
      if (!formData.board) {
        updateField('board', 'CBSE');
      }
      if (newQual === '12th' && !formData.twelfthStream) {
        updateField('twelfthStream', TWELFTH_STREAMS[0]);
      }
    } else if (newQual === 'ITI') {
      updateField('degree', '');
      updateField('department', '');
      if (!formData.itiTrade) {
        updateField('itiTrade', ITI_TRADES[0]);
      }
    } else if (newQual === 'Diploma') {
      const degrees = DEGREES_BY_QUALIFICATION.Diploma;
      if (degrees && degrees.length > 0) {
        updateField('degree', degrees[0]);
      }
    } else {
      const newDegrees = DEGREES_BY_QUALIFICATION[newQual];
      if (newDegrees && newDegrees.length > 0) {
        updateField('degree', newDegrees[0]);
      }
    }
  };

  const handleScoreTypeChange = (type: 'percentage' | 'cgpa') => {
    updateField('scoreType', type);
    if (formData.scoreValue) {
      updateField(
        'gradeScore',
        type === 'percentage' ? `${formData.scoreValue}%` : `${formData.scoreValue} CGPA`
      );
    }
  };

  const handleScoreValueChange = (val: string) => {
    updateField('scoreValue', val);
    if (val) {
      updateField(
        'gradeScore',
        formData.scoreType === 'percentage' ? `${val}%` : `${val} CGPA`
      );
    } else {
      updateField('gradeScore', '');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
      {/* ============================================================== */}
      {/* 1. CLASSIFICATION: FRESHER OR EXPERIENCED                      */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Are you a Fresher or Experienced Candidate? <span className="text-rose-500">*</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card: Fresher */}
          <button
            type="button"
            onClick={() => updateField('candidateType', 'fresher')}
            className={`p-4 rounded-xl border text-left transition-all relative flex items-start gap-4 cursor-pointer ${
              isFresher
                ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isFresher ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-base">Fresher</span>
                {isFresher && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                School/college graduate, student, or entry-level applicant.
              </p>
            </div>
          </button>

          {/* Card: Experienced */}
          <button
            type="button"
            onClick={() => updateField('candidateType', 'experienced')}
            className={`p-4 rounded-xl border text-left transition-all relative flex items-start gap-4 cursor-pointer ${
              !isFresher
                ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                !isFresher ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-base">Experienced</span>
                {!isFresher && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Working professional with prior corporate or industry experience.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PERSONAL INFORMATION                                        */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* 1. Full Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-500">{errors.fullName}</p>}
          </div>

          {/* 2. Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                  errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
          </div>

          {/* 3. Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="candidate@company.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                  errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
          </div>

          {/* 4. Date of Birth (DOB) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Date of Birth (DOB) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => updateField('dob', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums transition-colors ${
                  errors.dob ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.dob && <p className="text-xs text-rose-500">{errors.dob}</p>}
          </div>

          {/* 5. Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Gender <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <select
                value={formData.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Preferred Location */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
              Preferred Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.preferredLocation}
                onChange={(e) => updateField('preferredLocation', e.target.value)}
                placeholder="e.g. Bengaluru, Pune, or Remote"
                className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                  errors.preferredLocation ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.preferredLocation && (
              <p className="text-xs text-rose-500">{errors.preferredLocation}</p>
            )}
          </div>

          {/* 7. Designation (Requested for Experienced candidates) */}
          {!isFresher && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Designation / Current Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => updateField('designation', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors ${
                    errors.designation ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.designation && (
                <p className="text-xs text-rose-500">{errors.designation}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. EDUCATIONAL FIELDS (FOR FRESHERS ONLY)                      */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isFresher && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6">
              {/* Passed Out vs Still Pursuing */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-3">
                  Are you Passed Out or Still Pursuing? <span className="text-rose-500">*</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateField('fresherStatus', 'passed_out')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isPassedOut
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white/70 border-slate-200 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isPassedOut ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Passed Out (Graduated)</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Completed studies and received marks/certificate.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('fresherStatus', 'still_pursuing')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      !isPassedOut
                        ? 'bg-white border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                        : 'bg-white/70 border-slate-200 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        !isPassedOut ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Still Pursuing</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Currently enrolled and studying.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* HIGHEST QUALIFICATION SELECTOR (UG, PG, Diploma, 12th, 10th, ITI) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                  Highest Qualification <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {QUALIFICATIONS.map((q) => {
                    const isSelected = formData.highestQualification === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleQualificationChange(q.id)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'bg-white/70 border-slate-200 hover:bg-white text-slate-600'
                        }`}
                      >
                        <div
                          className={`font-bold text-sm ${
                            isSelected ? 'text-indigo-600' : 'text-slate-900'
                          }`}
                        >
                          {q.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{q.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================== */}
              {/* CONDITIONAL BRANCH A: 10TH STANDARD                            */}
              {/* No Degree, No Department, No Semesters/Academic Stage          */}
              {/* Fields: Board, School Name, Passing Year, Marks (CGPA or %)   */}
              {/* ============================================================== */}
              {isTenth && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  {/* Board */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      10th Education Board <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.board}
                      onChange={(e) => updateField('board', e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                        errors.board ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    >
                      {BOARDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {errors.board && <p className="text-xs text-rose-500">{errors.board}</p>}
                  </div>

                  {/* If Other Board, text input */}
                  {formData.board === 'Other Board' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Specify Board Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.otherBoardName || ''}
                        onChange={(e) => updateField('otherBoardName', e.target.value)}
                        placeholder="e.g. Maharashtra State Board"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  )}

                  {/* School Name */}
                  <div className={`space-y-1.5 ${formData.board === 'Other Board' ? 'sm:col-span-2' : ''}`}>
                    <label className="block text-xs font-semibold text-slate-700">
                      School / High School Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => updateField('collegeName', e.target.value)}
                        placeholder="e.g. St. Xavier's High School, Kendriya Vidyalaya"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                          errors.collegeName ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.collegeName && (
                      <p className="text-xs text-rose-500">{errors.collegeName}</p>
                    )}
                  </div>

                  {/* If Passed Out: Year of Passing & Marks in CGPA or Percentage */}
                  {isPassedOut ? (
                    <>
                      {/* Year of Passing */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Year of Passing <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.passingYear}
                          onChange={(e) => updateField('passingYear', e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums"
                        >
                          {PASSING_YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        {errors.passingYear && (
                          <p className="text-xs text-rose-500">{errors.passingYear}</p>
                        )}
                      </div>

                      {/* Marks in CGPA or Percentage */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-slate-700">
                            Marks in CGPA or Percentage <span className="text-rose-500">*</span>
                          </label>
                          <div className="inline-flex items-center p-0.5 bg-slate-200/90 rounded-lg text-[11px] font-medium">
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('percentage')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'percentage'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Percentage (%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('cgpa')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'cgpa'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              CGPA (out of 10)
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={formData.scoreType === 'percentage' ? '100' : '10'}
                            value={formData.scoreValue}
                            onChange={(e) => handleScoreValueChange(e.target.value)}
                            placeholder={
                              formData.scoreType === 'percentage' ? 'e.g. 88.5' : 'e.g. 9.2'
                            }
                            className={`w-full px-3.5 pr-14 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums ${
                              errors.scoreValue ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                            }`}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                            {formData.scoreType === 'percentage' ? '%' : '/ 10'}
                          </div>
                        </div>
                        {errors.scoreValue && (
                          <p className="text-xs text-rose-500">{errors.scoreValue}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    /* If Still Pursuing 10th */
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Expected 10th Completion Year <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.expectedPassingYear || '2026'}
                        onChange={(e) => updateField('expectedPassingYear', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums"
                      >
                        {EXPECTED_PURSUING_YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* CONDITIONAL BRANCH B: 12TH STANDARD                            */}
              {/* No Degree, No Department, No Semesters/Academic Stage          */}
              {/* Fields: 12th Stream, Board, School/College Name, Passing Year, */}
              {/* Marks (CGPA or Percentage)                                     */}
              {/* ============================================================== */}
              {isTwelfth && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  {/* 12th Stream */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      12th Stream / Specialisation <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.twelfthStream}
                      onChange={(e) => updateField('twelfthStream', e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                        errors.twelfthStream ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    >
                      {TWELFTH_STREAMS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.twelfthStream && (
                      <p className="text-xs text-rose-500">{errors.twelfthStream}</p>
                    )}
                  </div>

                  {/* 12th Education Board */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      12th Education Board <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.board}
                      onChange={(e) => updateField('board', e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                        errors.board ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    >
                      {BOARDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {errors.board && <p className="text-xs text-rose-500">{errors.board}</p>}
                  </div>

                  {/* School / Junior College Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      School / Junior College Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => updateField('collegeName', e.target.value)}
                        placeholder="e.g. Delhi Public School, Modern Junior College"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                          errors.collegeName ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.collegeName && (
                      <p className="text-xs text-rose-500">{errors.collegeName}</p>
                    )}
                  </div>

                  {/* If Passed Out: Year of Passing & Marks in CGPA or Percentage */}
                  {isPassedOut ? (
                    <>
                      {/* Year of Passing */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Year of Passing <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.passingYear}
                          onChange={(e) => updateField('passingYear', e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums"
                        >
                          {PASSING_YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        {errors.passingYear && (
                          <p className="text-xs text-rose-500">{errors.passingYear}</p>
                        )}
                      </div>

                      {/* Marks in CGPA or Percentage */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-slate-700">
                            Marks in CGPA or Percentage <span className="text-rose-500">*</span>
                          </label>
                          <div className="inline-flex items-center p-0.5 bg-slate-200/90 rounded-lg text-[11px] font-medium">
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('percentage')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'percentage'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Percentage (%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('cgpa')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'cgpa'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              CGPA (out of 10)
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={formData.scoreType === 'percentage' ? '100' : '10'}
                            value={formData.scoreValue}
                            onChange={(e) => handleScoreValueChange(e.target.value)}
                            placeholder={
                              formData.scoreType === 'percentage' ? 'e.g. 91.4' : 'e.g. 8.8'
                            }
                            className={`w-full px-3.5 pr-14 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums ${
                              errors.scoreValue ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                            }`}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                            {formData.scoreType === 'percentage' ? '%' : '/ 10'}
                          </div>
                        </div>
                        {errors.scoreValue && (
                          <p className="text-xs text-rose-500">{errors.scoreValue}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    /* If Still Pursuing 12th */
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Expected 12th Completion Year <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.expectedPassingYear || '2026'}
                        onChange={(e) => updateField('expectedPassingYear', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums"
                      >
                        {EXPECTED_PURSUING_YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* CONDITIONAL BRANCH C: ITI (Industrial Training)                */}
              {/* Fields: ITI Trade, ITI Institute, Passing Year, Marks          */}
              {/* ============================================================== */}
              {isITI && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  {/* ITI Trade */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      ITI Trade / Course <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.itiTrade}
                      onChange={(e) => updateField('itiTrade', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      {ITI_TRADES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ITI Institute Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      ITI Institute / College Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => updateField('collegeName', e.target.value)}
                        placeholder="e.g. Government ITI, Bangalore"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                          errors.collegeName ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.collegeName && (
                      <p className="text-xs text-rose-500">{errors.collegeName}</p>
                    )}
                  </div>

                  {/* If Passed Out vs Pursuing */}
                  {isPassedOut ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Year of Passing <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.passingYear}
                          onChange={(e) => updateField('passingYear', e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums"
                        >
                          {PASSING_YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Marks in CGPA or Percentage */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-slate-700">
                            Marks in CGPA or Percentage
                          </label>
                          <div className="inline-flex items-center p-0.5 bg-slate-200/90 rounded-lg text-[11px] font-medium">
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('percentage')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'percentage'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Percentage (%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('cgpa')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'cgpa'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              CGPA
                            </button>
                          </div>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.scoreValue}
                          onChange={(e) => handleScoreValueChange(e.target.value)}
                          placeholder={formData.scoreType === 'percentage' ? 'e.g. 82.5' : 'e.g. 8.2'}
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Expected ITI Completion Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="month"
                        value={formData.expectedGraduation}
                        onChange={(e) => updateField('expectedGraduation', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* CONDITIONAL BRANCH D: UG, PG, DIPLOMA                          */}
              {/* Degree, Department, College Name, Passing Year / Semester      */}
              {/* Marks in CGPA or Percentage                                    */}
              {/* ============================================================== */}
              {(isDegreeBased || isDiploma) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  {/* Degree / Course */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isDiploma ? 'Diploma Course / Branch' : `Degree (${formData.highestQualification})`}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.degree}
                      onChange={(e) => updateField('degree', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      {currentDegrees.map((deg) => (
                        <option key={deg} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Department / Branch / Specialisation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => updateField('department', e.target.value)}
                      placeholder="e.g. Computer Science, Mechanical, Finance"
                      className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                        errors.department ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.department && (
                      <p className="text-xs text-rose-500">{errors.department}</p>
                    )}
                  </div>

                  {/* College / University Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isDiploma ? 'Polytechnic / Institute Name' : 'College / University Name'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => updateField('collegeName', e.target.value)}
                        placeholder={
                          isDiploma
                            ? 'e.g. Government Polytechnic, Pune'
                            : 'e.g. National Institute of Technology, Karnataka'
                        }
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${
                          errors.collegeName ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.collegeName && (
                      <p className="text-xs text-rose-500">{errors.collegeName}</p>
                    )}
                  </div>

                  {/* If Passed Out: Year of Passing & Marks */}
                  {isPassedOut ? (
                    <>
                      {/* Year of Passing */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Year of Passing <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.passingYear}
                          onChange={(e) => updateField('passingYear', e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums"
                        >
                          {PASSING_YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Marks in CGPA or Percentage */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-slate-700">
                            Marks in CGPA or Percentage
                          </label>
                          <div className="inline-flex items-center p-0.5 bg-slate-200/90 rounded-lg text-[11px] font-medium">
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('percentage')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'percentage'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Percentage (%)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScoreTypeChange('cgpa')}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                formData.scoreType === 'cgpa'
                                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              CGPA (out of 10)
                            </button>
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={formData.scoreType === 'percentage' ? '100' : '10'}
                            value={formData.scoreValue}
                            onChange={(e) => handleScoreValueChange(e.target.value)}
                            placeholder={
                              formData.scoreType === 'percentage' ? 'e.g. 84.5' : 'e.g. 8.7'
                            }
                            className="w-full px-3.5 pr-14 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                            {formData.scoreType === 'percentage' ? '%' : '/ 10'}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* If Still Pursuing UG/PG/Diploma: Academic Stage & Expected Date */
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Current Academic Stage <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.currentYearSemester}
                          onChange={(e) => updateField('currentYearSemester', e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                        >
                          {HIGHER_ED_STAGES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Expected Graduation (Month & Year) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="month"
                          value={formData.expectedGraduation}
                          onChange={(e) => updateField('expectedGraduation', e.target.value)}
                          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono tabular-nums ${
                            errors.expectedGraduation ? 'border-rose-400' : 'border-slate-200'
                          }`}
                        />
                        {errors.expectedGraduation && (
                          <p className="text-xs text-rose-500">{errors.expectedGraduation}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 4. SUBMIT ACTION                                               */}
      {/* ============================================================== */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-98'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting Form...' : 'Submit Onboarding Form'}</span>
        </button>
      </div>
    </form>
  );
};
