# Candidate Onboarding Portal

An intuitive, lightweight candidate onboarding application featuring smart conditional branching tailored specifically for **Freshers** (Passed Out vs. Still Pursuing) and **Experienced** professionals, complete with instant validation, live review, and an HR submission manager.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The onboarding experience is designed to be frictionless and clean. Based on your prompt, the form branches dynamically depending on candidate status:
> - **Fresher**: Branches into **Passed Out (Graduated)** or **Still Pursuing (Current Student)**, asking tailored questions for degree, graduation year/semester, and availability.
> - **Experienced**: Collects relevant work history including total experience, current employer, role, notice period, and compensation expectations.
> - Includes an **HR Management View** toggle so you can review, filter, and export submitted candidate onboarding profiles.

---

### 1. Overview & Core Concept

- **What It Does**: Provides candidates with a guided, clutter-free onboarding form that dynamically adapts its fields based on whether the candidate is a fresher or experienced hire. Freshers are asked whether they have completed their studies or are currently enrolled, displaying only the relevant academic timeline and availability fields.
- **Target Audience**: New hires, campus recruits, interns, and experienced lateral hires completing their pre-boarding or initial documentation intake.
- **Key Value**: Eliminates irrelevant form fields and mental fatigue through progressive disclosure, preventing submission errors and accelerating candidate intake.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Candidate Contact & Role Basics**:
   - Full Name, Email, Phone Number, Target Position / Department.
2. **Experience Classification (Primary Branching)**:
   - Interactive segmented selection: **Fresher** or **Experienced**.
   - *Fresher Path*:
     - Sub-selection: **Passed Out** vs. **Still Pursuing**.
     - *Passed Out*: Degree, College/University, Passing Year, Final Grade/Percentage, Immediate Joining Date.
     - *Still Pursuing*: Degree & Specialization, University, Current Semester/Year, Expected Graduation Date, Internship/Training Availability.
   - *Experienced Path*:
     - Total Experience (Years & Months), Current/Last Employer, Current Title, Notice Period, Current CTC, Expected CTC, Primary Technical/Functional Skills.
3. **Preferences & Additional Details**:
   - Preferred Work Mode (Remote / Hybrid / Onsite), Current City, Resume/Portfolio link or attachment, Notes.
4. **Instant Review & Submission**:
   - Live summary card displaying all candidate data for verification before final submission.
   - Interactive "Edit Section" jumps back to any step seamlessly.
5. **HR Candidate Records & Management Tab**:
   - Switchable view displaying a clean table of all onboarded candidates, status filters (All / Fresher Passed Out / Fresher Pursuing / Experienced), candidate detail drawer, and CSV/JSON export.
   - "Fill Sample Data" demo buttons (Fresher & Experienced) for instant review without typing.

#### Visual Identity & Theme
- **Aesthetic Direction**: Modern enterprise clarity — crisp typography, calm slate and indigo palette, high spatial comfort, and clear visual hierarchy.
- **Color Palette & Mood**:
  - Canvas: Neutral crisp background (`#F8FAFC` / `#FFFFFF`)
  - Accent / Primary CTA: Deep Indigo (`#4F46E5` / `#4338CA`)
  - Borders & Hairlines: Subdued hairline dividers (`#E2E8F0`)
  - Semantic Status: Emerald for submitted/passed-out (`#059669`), Sky for pursuing (`#0284C7`), Violet for experienced (`#7C3AED`).
- **Zero-Pill Metadata**: Metadata labels displayed as clean unboxed text separated by typographic middots (`·`) rather than heavy pill badges.
- **Motion & Micro-interactions**: Smooth animated step transitions using `motion`, subtle focus rings on inputs, and clear active states.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Progressive Multi-Step Stepper vs Single Wall of Inputs**
  - *Chosen Approach*: Multi-step guided wizard with a visible progress bar, combined with an instant pre-submission review step.
  - *Why*: Reduces cognitive load by focusing the candidate on one decision at a time (Classification → Branch Details → Preferences → Review).
  - *Alternatives Considered*: A massive single-page form with sudden layout shifts that can disorient candidates on mobile devices.

- **Decision 2: Local Persistence & HR Management Console**
  - *Chosen Approach*: Browser `localStorage` persistence with seed sample records and instant export capability.
  - *Why*: Allows immediate end-to-end testing of submissions, reviewing submitted candidate profiles, and downloading records without requiring complex external backend dependencies.

- **Decision 3: Quick Demo Fill Buttons**
  - *Chosen Approach*: One-click "Load Fresher Sample" and "Load Experienced Sample" presets in the header bar.
  - *Why*: Enables rapid verification of both conditional logic branches without tedious manual typing during review.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Candidate Onboarding App                        │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Top Bar: Brand, Step Indicator, Sample Fillers, HR View Toggle   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────────┐      ┌───────────────────────────────┐  │
│  │    Candidate Form View    │      │    HR Submissions Manager     │  │
│  │                           │      │                               │  │
│  │  1. Personal Information  │      │  - Candidate Records Table    │  │
│  │  2. Experience & Branch   │ ───► │  - Branch Filter (Fresher/Exp)│  │
│  │     ├─ Fresher            │      │  - Detail Dossier Drawer      │  │
│  │     │   ├─ Passed Out     │      │  - CSV / JSON Export          │  │
│  │     │   └─ Pursuing       │      │  - Delete / Clear Records     │  │
│  │     └─ Experienced        │      └───────────────────────────────┘  │
│  │  3. Logistics & Details   │                                         │
│  │  4. Verification & Submit │                                         │
│  └───────────────────────────┘                                         │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ State Engine: TypeScript Schema, Validation, LocalStorage Sync   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Schema
```typescript
interface CandidateOnboardingData {
  id: string;
  submittedAt: string;
  // Step 1: Personal
  fullName: string;
  email: string;
  phone: string;
  targetRole: string;
  location: string;
  workPreference: 'Remote' | 'Hybrid' | 'Onsite';
  
  // Primary Branch
  candidateType: 'fresher' | 'experienced';
  
  // Fresher Branch
  fresherStatus?: 'passed_out' | 'still_pursuing';
  // If Passed Out:
  degree?: string;
  institution?: string;
  graduationYear?: string;
  gradeScore?: string;
  immediateJoining?: boolean;
  // If Still Pursuing:
  pursuingDegree?: string;
  currentYearSemester?: string;
  expectedGraduation?: string;
  internshipAvailability?: string;
  
  // Experienced Branch
  totalExperienceYears?: string;
  currentCompany?: string;
  currentDesignation?: string;
  noticePeriod?: string;
  currentSalary?: string;
  expectedSalary?: string;
  keySkills?: string;
  
  // Additional
  portfolioUrl?: string;
  additionalNotes?: string;
}
```

---

### Implementation Steps

1. **Setup & Dependencies**:
   - Configure metadata, title, and styling in `index.html` and `metadata.json`.
   - Ensure Lucide icons and Framer Motion are utilized for fluid state transitions.
2. **Data & Types**:
   - Define strong TypeScript types for form branches and validation rules in `src/types/candidate.ts`.
3. **Form Component Engine**:
   - `PersonalInfoStep`: Clean name, email, phone, role inputs with validation.
   - `ExperienceBranchStep`: High-clarity toggle between Fresher & Experienced.
     - Dynamic sub-branch for Fresher: "Passed Out" vs "Still Pursuing".
     - Dynamic sub-branch for Experienced: Employment history & notice period.
   - `PreferencesStep`: Work mode, location, links, joining timeline.
   - `ReviewSummaryStep`: Full preview card before submission.
4. **HR Management View**:
   - Submissions list, search/filter by candidate type, candidate detail drawer, and CSV exporter.
5. **Polishing & Verification**:
   - Build validation with `compile_applet` and responsive design testing across desktop and mobile viewports.
