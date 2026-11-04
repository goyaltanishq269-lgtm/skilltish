# SkillTish — 48-Hour MVP

> **Proof-of-Work Micro-Tasks & Cryptographically Verifiable Skill Badges**  
> Bridging ambitious students and startup founders through short-sprint deliverables (1 day to 2 weeks), eliminating resume fluff with authentic proof of work.

---

## 🚀 Quick Start

### 1. Install Dependencies & Build
```bash
npm install
npm run build
npm start
```
The application will launch at **`http://localhost:3000`**.

### 2. Instant 1-Click Demo Accounts
The landing page (`/`) and navigation bar have built-in **1-click authentication** for the two pre-configured core personas:

| Persona | Name | Email | Role | Organization |
| :--- | :--- | :--- | :--- | :--- |
| **Student Demo** | Alex Chen | `student@college.edu` | `student` | Apex Tech Institute |
| **Poster Demo** | Priya Sharma | `founder@startup.com` | `poster` | DevStudio |

> **Note:** NextAuth Credentials provider is configured so clicking the demo buttons signs you in instantly with pre-populated sessions and role-based permissions without requiring password entry.

---

## 🛠️ Stack & Architecture

- **Framework**: Next.js 14+ (App Router, Server & Client Components, TypeScript)
- **Styling**: Tailwind CSS with custom branding and Lucide React icons
- **Authentication**: NextAuth.js (JWT session strategy, role claims)
- **Database & Modeling**: MongoDB via Mongoose (`src/models/`) with resilient fallback to an active mock repository if local MongoDB is offline
- **Proof-of-Work Validation**: Support for GitHub Pull Requests / Repositories and Figma interactive prototype links

---

## 📂 Data Models (`src/models/`)

1. **User** (`src/models/User.ts`):
   - `name`: String
   - `email`: String (unique)
   - `role`: `'student' | 'poster'`
   - `college`: String
   - `company`: String
   - `bio`: String
   - `skills`: Array of Strings
   - `avatar`: String

2. **Task** (`src/models/Task.ts`):
   - `title`: String
   - `description`: String
   - `skillsRequired`: Array of Strings
   - `duration`: `'1 day' | '3 days' | '1 week' | '2 weeks'`
   - `posterId`: Ref: User
   - `status`: `'open' | 'closed'`
   - `reward`: String (e.g., Verified Skill Badge)

3. **Submission** (`src/models/Submission.ts`):
   - `taskId`: Ref: Task
   - `studentId`: Ref: User
   - `proofUrl`: String (GitHub or Figma URL)
   - `notes`: String (Implementation architecture and approach)
   - `status`: `'pending' | 'approved' | 'rejected'`
   - `feedback`: String (Poster evaluation feedback)

4. **Badge** (`src/models/Badge.ts`):
   - `title`: String
   - `skill`: String
   - `taskId`: Ref: Task
   - `studentId`: Ref: User
   - `issuerId`: Ref: User
   - `issuedAt`: Date

---

## 🖥️ Key Pages & Workflows

### 1. Clean Landing Page (`/`)
- Hero section explaining the value proposition of proof-of-work credentials.
- **Two 1-Click Login Cards**: "Demo Student" (Alex Chen) and "Demo Poster" (Priya Sharma).
- Feature breakdown and sprint guidelines (1 day to 2 weeks).

### 2. Opportunity Feed (`/feed`)
- Browse available micro-tasks across technical domains.
- **Filters**:
  - Duration: `All`, `1 day`, `3 days`, `1 week`, `2 weeks`
  - Skills: `All`, `React`, `TypeScript`, `Tailwind CSS`, `Next.js`, `Figma`, `Node.js`, `NextAuth`
  - Real-time search query input.
- **"Post a Micro-Task" Modal**: Allows startup posters to create new sprints with title, description, skills, and target duration.

### 3. Task Detail & Submission (`/tasks/[id]`)
- Comprehensive overview of task requirements, poster background, and duration.
- **"Apply & Submit Work" Modal**: Allows students to submit their proof-of-work link (GitHub repo/PR or Figma prototype) along with implementation notes.
- Real-time status display if the student has already applied (Pending, Approved, or Rejected with feedback).

### 4. Poster Dashboard (`/dashboard`)
- Review portal for incoming student proof-of-work deliverables.
- Real-time counters: Total Submissions, Pending Review, Approved & Badges Minted, Rejected.
- External preview buttons for GitHub/Figma deliverables and student methodology notes.
- **Actions**:
  - **"Approve & Issue Badge"**: Mints a verified skill badge directly to the student's profile.
  - **"Reject"**: Provides constructive feedback.

### 5. Public Student Portfolio (`/profile/[id]`)
- Public portfolio showcasing:
  - Student identity, college, bio, and verified skills.
  - **Verified Skill Badges**: Authenticated badge cards with issuer verification seals and mint dates.
  - **Completed Micro-Tasks & Proof of Work**: Deliverables with direct inspect links to submitted GitHub code or Figma designs.
  - One-click shareable public link.

---

## 🧪 Automated Verification Suite

Run the full end-to-end integration test suite:
```bash
bash scripts/run-e2e-test.sh
```
This tests:
1. Mock user retrieval
2. Duration and skill filters
3. Micro-task creation
4. GitHub proof-of-work submission
5. Poster approval and badge minting
6. Public profile verification
7. HTTP 200 responses across all key pages (`/`, `/feed`, `/dashboard`, `/profile/[id]`)
