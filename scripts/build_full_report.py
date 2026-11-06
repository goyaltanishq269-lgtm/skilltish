import os
import zipfile
import re
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

DOCX_IN = '/Users/tanishqgoyal/.gemini/antigravity/brain/c559947c-73cf-4916-a25e-61f2764e4952/.user_uploaded/media_1793816203009_16028a17.docx'
DOCX_OUT = '/Users/tanishqgoyal/Desktop/sec/AI POWERED FULL STACK DEVELOPMENTsample report_2.docx'

def set_run_font(run, name='Times New Roman', size_pt=12, bold=False, italic=False, color_rgb=None):
    run.font.name = name
    if size_pt:
        run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    if color_rgb:
        run.font.color.rgb = RGBColor(*color_rgb)

def set_para_format(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=0, space_after_pt=6):
    p.alignment = align
    p.paragraph_format.line_spacing = line_spacing
    p.paragraph_format.space_before = Pt(space_before_pt)
    p.paragraph_format.space_after = Pt(space_after_pt)

def add_body_p(doc, text, bold_prefix="", bullet=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6):
    p = doc.add_paragraph(style='Body Text')
    set_para_format(p, align=align, line_spacing=1.5, space_before_pt=space_before, space_after_pt=space_after)
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_run_font(r_pre, name='Times New Roman', size_pt=12, bold=True)
    r_body = p.add_run(text)
    set_run_font(r_body, name='Times New Roman', size_pt=12, bold=False)
    if bullet:
        p.paragraph_format.left_indent = Inches(0.25)
    return p

def add_heading_p(doc, text, level=2, space_before=18, space_after=6, page_break=False):
    style_name = f'Heading {level}'
    p = doc.add_paragraph(style=style_name)
    if page_break:
        p.paragraph_format.page_break_before = True
    set_para_format(p, align=WD_ALIGN_PARAGRAPH.LEFT, line_spacing=1.15, space_before_pt=space_before, space_after_pt=space_after)
    r = p.add_run(text)
    sz = 18 if level == 2 else (14 if level == 3 else 12)
    set_run_font(r, name='Times New Roman', size_pt=sz, bold=True)
    return p

def add_code_block(doc, lines):
    for idx, line in enumerate(lines):
        p = doc.add_paragraph()
        sb = 6 if idx == 0 else 0
        sa = 6 if idx == len(lines) - 1 else 1
        set_para_format(p, align=WD_ALIGN_PARAGRAPH.LEFT, line_spacing=1.0, space_before_pt=sb, space_after_pt=sa)
        p.paragraph_format.left_indent = Inches(0.4)
        r = p.add_run(line)
        set_run_font(r, name='Courier New', size_pt=10, bold=False)

def main():
    doc = docx.Document(DOCX_IN)
    
    # -------------------------------------------------------------
    # 1. COVER PAGE (Paragraphs 0 to 33)
    # -------------------------------------------------------------
    doc.paragraphs[9].text = "SKILL ENHANCEMENT COURSE-II"
    doc.paragraphs[10].text = "AI POWERED FULL STACK DEVELOPMENT"
    
    # P11: Project title
    doc.paragraphs[11].text = "PROJECT REPORT ON:\nSKILLTISH: A MICRO-INTERNSHIP SPRINT ENGINE WITH CRYPTOGRAPHIC PROOF-OF-WORK CREDENTIALS"
    for r in doc.paragraphs[11].runs:
        set_run_font(r, name='Times New Roman', size_pt=14, bold=True)
    doc.paragraphs[11].alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    doc.paragraphs[15].text = "Submitted by:"
    doc.paragraphs[15].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[15].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)
        
    doc.paragraphs[17].text = "TANISHQ GOYAL (ENG25CS0822)"
    doc.paragraphs[17].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[17].runs:
        set_run_font(r, name='Times New Roman', size_pt=13, bold=True)
        
    doc.paragraphs[18].text = "2nd Year, 3rd Semester, Section L (Roll No: 13)"
    doc.paragraphs[18].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[18].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[19].text = ""
    doc.paragraphs[20].text = ""
    
    doc.paragraphs[23].text = "Under the supervision of:"
    doc.paragraphs[23].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[23].runs:
        set_run_font(r, name='Times New Roman', size_pt=13, bold=False)
        
    doc.paragraphs[24].text = "Course Faculty / Project Coordinator"
    doc.paragraphs[24].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[24].runs:
        set_run_font(r, name='Times New Roman', size_pt=13, bold=True)
        
    doc.paragraphs[25].text = "Department of Computer Science & Engineering"
    doc.paragraphs[25].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[25].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)
        
    doc.paragraphs[29].text = "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING"
    doc.paragraphs[29].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[29].runs:
        set_run_font(r, name='Times New Roman', size_pt=13, bold=True)
        
    doc.paragraphs[30].text = "SCHOOL OF ENGINEERING, DAYANANDA SAGAR UNIVERSITY"
    doc.paragraphs[30].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[30].runs:
        set_run_font(r, name='Times New Roman', size_pt=13, bold=True)
        
    doc.paragraphs[31].text = "(2026–2027)"
    doc.paragraphs[31].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in doc.paragraphs[31].runs:
        set_run_font(r, name='Times New Roman', size_pt=13, bold=True)

    # -------------------------------------------------------------
    # 2. CERTIFICATE PAGE (Paragraphs 34 to 60)
    # -------------------------------------------------------------
    cert_text = (
        "This is to certify that the project work titled “SKILLTISH: A MICRO-INTERNSHIP SPRINT "
        "ENGINE WITH CRYPTOGRAPHIC PROOF-OF-WORK CREDENTIALS” is a bonafide work carried out by "
        "Tanishq Goyal (USN: ENG25CS0822), a bonafide student of the 3rd Semester, 2nd Year (Section L) "
        "of Bachelor of Technology in Computer Science and Engineering at the School of Engineering, "
        "Dayananda Sagar University, Bangalore, in partial fulfillment of the requirements for the "
        "course Skill Enhancement Course-II: AI Powered Full Stack Development during the academic year 2026–2027."
    )
    doc.paragraphs[40].text = cert_text
    set_para_format(doc.paragraphs[40], align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=14, space_after_pt=18)
    for r in doc.paragraphs[40].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)
        
    doc.paragraphs[41].text = ""
    doc.paragraphs[42].text = ""
    
    # Signature headers and lines
    doc.paragraphs[43].text = "Course Coordinator / Guide\t\tChairman\t\tDean"
    for r in doc.paragraphs[43].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[44].text = ""
    doc.paragraphs[45].text = ""
    
    doc.paragraphs[46].text = "Dept. of CSE, SOE, DSU\t\tDept. of CSE, SOE, DSU\t\tSchool of Engineering, DSU"
    for r in doc.paragraphs[46].runs:
        set_run_font(r, name='Times New Roman', size_pt=11, bold=False)
        
    doc.paragraphs[47].text = "Date: _______________\t\tDate: _______________\t\tDate: _______________"
    for r in doc.paragraphs[47].runs:
        set_run_font(r, name='Times New Roman', size_pt=11, bold=False)
        
    for p_i in range(48, 61):
        doc.paragraphs[p_i].text = ""

    # -------------------------------------------------------------
    # 3. DECLARATION PAGE (Paragraphs 61 to 78)
    # -------------------------------------------------------------
    decl_text = (
        "I, Tanishq Goyal (USN: ENG25CS0822), student of the 3rd Semester, 2nd Year (Section L), "
        "Bachelor of Technology in Computer Science and Engineering, at School of Engineering, "
        "Dayananda Sagar University, hereby declare that the project entitled “SKILLTISH: A MICRO-INTERNSHIP "
        "SPRINT ENGINE WITH CRYPTOGRAPHIC PROOF-OF-WORK CREDENTIALS” has been independently carried out "
        "by me under academic supervision and submitted in partial fulfillment for the course in Bachelor of "
        "Technology in Computer Science and Engineering during the academic year 2026–2027. The matter embodied "
        "in this report has not been submitted for the award of any other degree or diploma."
    )
    doc.paragraphs[63].text = decl_text
    set_para_format(doc.paragraphs[63], align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=14, space_after_pt=18)
    for r in doc.paragraphs[63].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)
        
    for p_i in range(64, 70):
        doc.paragraphs[p_i].text = ""
        
    doc.paragraphs[70].text = "Student Signature: __________________________"
    for r in doc.paragraphs[70].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[71].text = "Name: Tanishq Goyal"
    for r in doc.paragraphs[71].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[72].text = "USN: ENG25CS0822"
    for r in doc.paragraphs[72].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[73].text = "Class: 2nd Year, 3rd Semester, Section L (Roll No: 13)"
    for r in doc.paragraphs[73].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[74].text = "Place: Bengaluru"
    for r in doc.paragraphs[74].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[75].text = "Date: November 4, 2026"
    for r in doc.paragraphs[75].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=True)
        
    doc.paragraphs[76].text = ""
    doc.paragraphs[77].text = ""

    # -------------------------------------------------------------
    # 4. ABSTRACT (Paragraphs 82 to 86)
    # -------------------------------------------------------------
    doc.paragraphs[82].text = "ABSTRACT"
    for r in doc.paragraphs[82].runs:
        set_run_font(r, name='Times New Roman', size_pt=18, bold=True)
        
    abstract_p1 = (
        "Traditional engineering hiring suffers from severe credential inflation, unverifiable claims "
        "on static resumes, and widespread code replication from public tutorial repositories. Technical founders "
        "and engineering managers commit substantial bandwidth to reviewing take-home assessments that fail to "
        "reflect actual production backlogs, while capable undergraduate student developers struggle to establish "
        "authentic credibility."
    )
    abstract_p2 = (
        "SkillTish resolves this systemic inefficiency by introducing an asynchronous micro-internship sprint "
        "engine that connects students directly to scoped, production backlog tickets posted by early-stage tech ventures. "
        "Rather than relying on self-reported proficiencies, students claim time-bounded engineering sprints "
        "(ranging from 1 to 7 days), implement required features or bug resolutions, and submit pull requests "
        "accompanied by Git commit hashes and diff logs. Startups audit submissions via an embedded code-review terminal drawer."
    )
    abstract_p3 = (
        "Upon code acceptance, the system automatically mints an immutable, tamper-evident cryptographic credential "
        "backed by a SHA-256 digest that binds student identity, project requirements, pull request metadata, and issuing "
        "authority into a publicly verifiable web certificate (/verify/[hash]). SkillTish is engineered on Next.js 14 App "
        "Router, TypeScript, Tailwind CSS, Framer Motion, and MongoDB Atlas, replacing unverified claims with cryptographic trust."
    )
    doc.paragraphs[83].text = abstract_p1
    set_para_format(doc.paragraphs[83], align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=12, space_after_pt=6)
    for r in doc.paragraphs[83].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)
        
    doc.paragraphs[84].text = abstract_p2
    set_para_format(doc.paragraphs[84], align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=0, space_after_pt=6)
    for r in doc.paragraphs[84].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)
        
    doc.paragraphs[85].text = abstract_p3
    set_para_format(doc.paragraphs[85], align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=0, space_after_pt=6)
    for r in doc.paragraphs[85].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)

    # -------------------------------------------------------------
    # 5. Clear all old body paragraphs from 87 to 257 (except keeping section break if present)
    # -------------------------------------------------------------
    # Note: paragraph 86 has the sectPr separating front matter from body. We keep paragraph 86.
    # We will remove paragraphs 87 to end, and cleanly rebuild the report chapters!
    
    # Let's verify which paragraphs to remove
    body_elements_to_remove = []
    for p in doc.paragraphs[87:]:
        # If paragraph has sectPr, do not remove, just clear text
        if p._element.xpath('./w:pPr/w:sectPr'):
            p.text = ""
        else:
            body_elements_to_remove.append(p)
            
    for p in body_elements_to_remove:
        p._element.getparent().remove(p._element)

    # -------------------------------------------------------------
    # 6. BUILD BODY CHAPTERS
    # -------------------------------------------------------------
    
    # CHAPTER 1: INTRODUCTION & PROJECT SCOPE
    add_heading_p(doc, "CHAPTER 1: INTRODUCTION & PROJECT SCOPE", level=2, space_before=18, space_after=12)
    add_body_p(doc, (
        "The transition from university computer science programs to industry engineering roles presents a "
        "persistent verification bottleneck. While academic curricula assess theoretical foundations, engineering "
        "teams prioritize practical delivery speed, codebase navigation, version control discipline, and code review "
        "compliance. Today's hiring workflows rely predominantly on static resumes, professional network endorsements, "
        "and personal portfolio links—mediums vulnerable to artificial enhancement and copied repositories."
    ))
    add_body_p(doc, (
        "SkillTish introduces a deliverable-driven framework bridging academic training and industrial requirements. "
        "By enabling organizations to publish actual engineering backlog tasks for students to execute under real-world "
        "sprint constraints, the platform establishes an auditable trial of competence. Each completed sprint links "
        "verified commits, reviewer approvals, and cryptographic signatures to construct a transparent developer profile "
        "grounded entirely in demonstrated execution."
    ))
    add_heading_p(doc, "1.1 Project Scope", level=3, space_before=12, space_after=6)
    add_body_p(doc, "Management of discovery, claiming, and submission pipelines for software sprints ranging from 24 hours to 7 days.", bold_prefix="• Scoped Sprint Lifecycle: ", bullet=True)
    add_body_p(doc, "Interactive slide-over reviewer interface allowing technical evaluators to inspect pull request diffs, branch metadata, and test statuses without leaving the workspace.", bold_prefix="• In-App Code Audit Drawer: ", bullet=True)
    add_body_p(doc, "Production of SHA-256 digest fingerprints linked to public verification routes (/verify/[hash]).", bold_prefix="• Cryptographic Proof Generation: ", bullet=True)
    add_body_p(doc, "Presentation of student achievements using physics-based 3D holographic tilt cards rendered with dynamic cursor-tracking light reflections.", bold_prefix="• Holographic Proof-of-Work Portfolio: ", bullet=True)

    # CHAPTER 2: PROBLEM DEFINITION
    add_heading_p(doc, "CHAPTER 2: PROBLEM DEFINITION", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "Resumes lack cryptographic integrity, offering no auditable link between self-reported proficiencies and actual merged code.", bold_prefix="1. Unverifiable Candidate Claims: ")
    add_body_p(doc, "Technical founders and engineering managers dedicate extensive engineering hours to reviewing take-home assessments that rarely reflect production backlogs.", bold_prefix="2. Screening Inefficiencies for Startups: ")
    add_body_p(doc, "Student portfolios frequently showcase identical tutorial projects, obscuring authentic problem-solving and architectural judgment.", bold_prefix="3. Tutorial Cloning in Portfolios: ")
    add_body_p(doc, "Conventional 3-month summer internships typically yield only binary recommendation letters, omitting granular insight into specific architectural competencies, code quality, or sprint performance.", bold_prefix="4. Binary Credentialing: ")

    # CHAPTER 3: LITERATURE SURVEY
    add_heading_p(doc, "CHAPTER 3: LITERATURE SURVEY", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "Focus primarily on self-reported histories and static employment dates, lacking granular visibility into code quality or architectural execution.", bold_prefix="• Traditional Recruitment Portals (LinkedIn, Indeed): ", bullet=True)
    add_body_p(doc, "Evaluate algorithmic optimization and asymptotic complexity, but do not assess modular software design, API architecture, full-stack integration, or real-world Git workflows.", bold_prefix="• Competitive Programming Platforms (LeetCode, HackerRank): ", bullet=True)
    add_body_p(doc, "Enable developers to resolve issues across open repositories, but the absence of curated scoping and structured onboarding presents a steep barrier for early-stage undergraduates.", bold_prefix="• Open Source Bounty Platforms (Gitcoin, IssueHunt): ", bullet=True)
    add_body_p(doc, "Define robust non-repudiation protocols, yet remain disconnected from automated source-control pipelines and native developer tooling.", bold_prefix="• Verifiable Credential Standards (W3C DID, Open Badges): ", bullet=True)

    # CHAPTER 4: PROJECT DESCRIPTION & SYSTEM ARCHITECTURE
    add_heading_p(doc, "CHAPTER 4: PROJECT DESCRIPTION & SYSTEM ARCHITECTURE", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "SkillTish is architected around a synchronized dual-persona workflow that connects engineering candidates directly with early-stage companies:")
    add_body_p(doc, "Verified companies log into their organization dashboard to post engineering backlog tasks with clear specifications, timeframes, and tech tags. When candidates submit deliverables, reviewers use an embedded code-review drawer to inspect branch commits and diffs.", bold_prefix="1. Company Workflow: ")
    add_body_p(doc, "Students browse live tickets on the active feed, claim tasks based on their tech preferences, and submit GitHub pull requests with commit SHAs.", bold_prefix="2. Student Workflow: ")
    add_body_p(doc, "Upon reviewer approval, a unique SHA-256 hash is generated from the student ID, sprint metadata, reviewer signature, and timestamp. The minted credential is permanently accessible via a dedicated verification URL.", bold_prefix="3. Cryptographic Verification Pipeline: ")

    # CHAPTER 5: REQUIREMENTS SPECIFICATION
    add_heading_p(doc, "CHAPTER 5: REQUIREMENTS SPECIFICATION", level=2, space_before=24, space_after=12, page_break=True)
    add_heading_p(doc, "5.1 Functional Requirements", level=3, space_before=10, space_after=6)
    add_body_p(doc, "Enable verified organizations to create, edit, and close sprint tasks with defined acceptance criteria and required technology stacks.", bold_prefix="• FR-1 (Sprint Marketplace): ", bullet=True)
    add_body_p(doc, "Provide students with multi-parameter filtering by technology stack, estimated duration, and complexity level.", bold_prefix="• FR-2 (Task Discovery & Filtering): ", bullet=True)
    add_body_p(doc, "Capture repository links, pull request identifiers, commit SHA fingerprints, and technical summaries upon sprint completion.", bold_prefix="• FR-3 (Submission Pipeline): ", bullet=True)
    add_body_p(doc, "Supply reviewers with an in-app slide-over drawer displaying diff details, branch origins, and PR status.", bold_prefix="• FR-4 (Integrated Code Inspection): ", bullet=True)
    add_body_p(doc, "Synthesize SHA-256 digests encoding student identifiers, sprint metadata, reviewer signatures, and issuance timestamps upon approval.", bold_prefix="• FR-5 (Cryptographic Proof Minting): ", bullet=True)
    add_body_p(doc, "Expose /verify/[hash] to display authoritative, non-repudiable audit certificates.", bold_prefix="• FR-6 (Public Audit Endpoint): ", bullet=True)

    add_heading_p(doc, "5.2 Non-Functional Requirements", level=3, space_before=14, space_after=6)
    add_body_p(doc, "Serverless API response times remain under 200 ms for active execution paths.", bold_prefix="• NFR-1 (Performance & Responsiveness): ", bullet=True)
    add_body_p(doc, "Strict environment isolation for database connection strings and JWT signing keys, alongside cryptographic hashing for sensitive credentials.", bold_prefix="• NFR-2 (Security & Integrity): ", bullet=True)
    add_body_p(doc, "Full layout responsiveness across standard device viewports ranging from 375 px (mobile) to 2560 px (desktop).", bold_prefix="• NFR-3 (Interface Adaptability): ", bullet=True)
    add_body_p(doc, "Redundant cloud cluster infrastructure via MongoDB Atlas with automatic connection pooling and retry capabilities.", bold_prefix="• NFR-4 (High Availability): ", bullet=True)

    # CHAPTER 6: METHODOLOGY & TECHNICAL FRAMEWORK
    add_heading_p(doc, "CHAPTER 6: METHODOLOGY & TECHNICAL FRAMEWORK", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "Implemented using React Server Components (RSC) to minimize client-side bundle size, paired with selective Client Components for interactive UI elements.", bold_prefix="1. Full-Stack Next.js 14 App Router: ")
    add_body_p(doc, "Utilized Tailwind CSS for utility-first styling combined with Framer Motion for coordinate transforms (rotateX, rotateY) on holographic cards.", bold_prefix="2. Styling & Micro-Interactions: ")
    add_body_p(doc, "Designed strict Mongoose schemas (User, Task, Submission, Credential) hosted on a MongoDB Atlas cloud cluster with global network access (0.0.0.0/0).", bold_prefix="3. Data Modeling & Cloud Persistence: ")
    add_body_p(doc, "Integrated native Web Audio API oscillators to construct procedural mechanical click feedback and harmonic chime signatures on credential minting without external MP3 assets.", bold_prefix="4. Browser Audio Synthesis: ")
    add_body_p(doc, "Built an accessible floating bottom-dock allowing one-click authentication switching between student (Alex Chen) and reviewer (Priya Sharma) contexts.", bold_prefix="5. Evaluator Session Switcher: ")

    # CHAPTER 7: EXPERIMENTATION & IMPLEMENTATION DETAILS
    add_heading_p(doc, "CHAPTER 7: EXPERIMENTATION & IMPLEMENTATION DETAILS", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "The implementation architecture integrates modern serverless cloud patterns and cryptographic verification routines.")
    
    add_heading_p(doc, "7.1 Core Credential Proof Schema", level=3, space_before=12, space_after=6)
    schema_code = [
        "interface ICredential {",
        "  credentialHash: string;      // SHA-256 Digest",
        "  studentId: ObjectId;         // Ref: User",
        "  companyId: ObjectId;         // Ref: User",
        "  taskId: ObjectId;            // Ref: Task",
        "  prUrl: string;               // GitHub Pull Request Link",
        "  commitSha: string;           // Final Merged Commit SHA",
        "  skillsVerified: string[];    // Extracted Tech Tags",
        "  issuedAt: Date;",
        "}"
    ]
    add_code_block(doc, schema_code)

    add_heading_p(doc, "7.2 Cryptographic Hash Computation", level=3, space_before=14, space_after=6)
    hash_code = [
        "import { createHash } from 'crypto';",
        "",
        "export function generateProofHash(payload: {",
        "  studentId: string;",
        "  taskId: string;",
        "  commitSha: string;",
        "  timestamp: number;",
        "}): string {",
        "  const serialized = `${payload.studentId}:${payload.taskId}:${payload.commitSha}:${payload.timestamp}`;",
        "  return 'SKL-' + createHash('sha256').update(serialized).digest('hex').substring(0, 16).toUpperCase();",
        "}"
    ]
    add_code_block(doc, hash_code)

    add_heading_p(doc, "7.3 Deployment Architecture", level=3, space_before=14, space_after=6)
    add_body_p(doc, "https://github.com/goyaltanishq269-lgtm/skilltish", bold_prefix="• Source Control: GitHub repository at ", bullet=True)
    add_body_p(doc, "Vercel Global Edge Network", bold_prefix="• Edge Delivery Platform: ", bullet=True)
    add_body_p(doc, "MongoDB Atlas AWS Cluster (Mumbai ap-south-1)", bold_prefix="• Cloud Database: ", bullet=True)
    add_body_p(doc, "https://skilltish-laur.vercel.app", bold_prefix="• Live Production Endpoint: ", bullet=True)

    # CHAPTER 8: RESULTS AND DISCUSSION
    add_heading_p(doc, "CHAPTER 8: RESULTS AND DISCUSSION", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "The full-stack platform was successfully deployed to production via Vercel and connected to a remote MongoDB Atlas instance, validating serverless API execution and cloud database initialization via /api/seed.", bold_prefix="• Live Cloud Deployment: ", bullet=True)
    add_body_p(doc, "The end-to-end review and minting workflow was evaluated, reliably issuing tamper-evident certificates directly accessible at dynamic routes (e.g., /verify/SKL-8492-NEXTJS).", bold_prefix="• Credential Verification Pipeline: ", bullet=True)
    add_body_p(doc, "Hardware-accelerated CSS transforms maintained 60 FPS across desktop and mobile devices, accurately calculating dynamic specular lighting based on cursor tracking.", bold_prefix="• Holographic 3D Rendering Performance: ", bullet=True)
    add_body_p(doc, "The bottom evaluator dock streamlined testing workflows, enabling rapid role alternation during live demonstrations without requiring manual credential re-entry.", bold_prefix="• Evaluation Usability: ", bullet=True)

    # CHAPTER 9: DELIVERABLES & PRODUCTION DEPLOYMENT
    add_heading_p(doc, "CHAPTER 9: DELIVERABLES & PRODUCTION DEPLOYMENT", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "Live, functional sprint platform hosted at https://skilltish-laur.vercel.app.", bold_prefix="1. Production Web Application: ")
    add_body_p(doc, "Documented TypeScript repository at https://github.com/goyaltanishq269-lgtm/skilltish.", bold_prefix="2. Open-Source Codebase: ")
    add_body_p(doc, "Live certificate route validating candidate deliverables against immutable commit records.", bold_prefix="3. Public Verification System: ")
    add_body_p(doc, "Comprehensive architecture diagrams, setup guidelines, and evaluator access accounts documented within the repository.", bold_prefix="4. Technical Documentation: ")

    # REFERENCES
    add_heading_p(doc, "REFERENCES", level=2, space_before=24, space_after=12, page_break=True)
    add_body_p(doc, "[1] Next.js 14 Official Documentation. App Router, Server Components, and Server Actions. Vercel Inc., 2024–2026.", space_after=4)
    add_body_p(doc, "[2] MongoDB Atlas Architecture Guide. Designing Scalable Multi-Tenant Document Schemas. MongoDB Inc., 2024.", space_after=4)
    add_body_p(doc, "[3] W3C Verifiable Credentials Data Model v2.0. Expressing Verifiable Claims Cryptographically on the Web. World Wide Web Consortium, 2024.", space_after=4)
    add_body_p(doc, "[4] Framer Motion API Documentation. 3D Perspective Transforms and Gestural Physics in React. Motion Software Inc., 2025.", space_after=4)
    add_body_p(doc, "[5] Web Audio API Specification. Synthesizing Interactive Audio in Modern Web Browsers. W3C Audio Working Group, 2024.", space_after=4)

    # Save python-docx modified document
    doc.save(DOCX_OUT)
    print("Full report generated via python-docx.")

    # -------------------------------------------------------------
    # 7. UPDATE TABLE OF CONTENTS SDT IN XML
    # -------------------------------------------------------------
    update_toc_xml(DOCX_OUT)

def update_toc_xml(docx_file):
    import tempfile, shutil
    temp_dir = tempfile.mkdtemp()
    with zipfile.ZipFile(docx_file, 'r') as z:
        z.extractall(temp_dir)
        
    doc_xml_path = os.path.join(temp_dir, 'word/document.xml')
    with open(doc_xml_path, 'r', encoding='utf-8') as f:
        xml_content = f.read()

    # Define replacement TOC items
    toc_items = [
        ("ABSTRACT", "iv", "TOC2", False),
        ("CHAPTER 1: INTRODUCTION & PROJECT SCOPE", "1", "TOC1", False),
        ("CHAPTER 2: PROBLEM DEFINITION", "3", "TOC1", False),
        ("CHAPTER 3: LITERATURE SURVEY", "4", "TOC1", False),
        ("CHAPTER 4: PROJECT DESCRIPTION & SYSTEM ARCHITECTURE", "6", "TOC1", False),
        ("CHAPTER 5: REQUIREMENTS SPECIFICATION", "8", "TOC1", False),
        ("5.1 Functional Requirements", "8", "TOC3", True),
        ("5.2 Non-Functional Requirements", "9", "TOC3", True),
        ("CHAPTER 6: METHODOLOGY & TECHNICAL FRAMEWORK", "10", "TOC1", False),
        ("CHAPTER 7: EXPERIMENTATION & IMPLEMENTATION DETAILS", "12", "TOC1", False),
        ("CHAPTER 8: RESULTS AND DISCUSSION", "15", "TOC1", False),
        ("CHAPTER 9: DELIVERABLES & PRODUCTION DEPLOYMENT", "17", "TOC1", False),
        ("REFERENCES", "18", "TOC1", False),
    ]

    new_sdt_paragraphs = []
    for title, page, style, is_sub in toc_items:
        tab_pos = "8960" if style == "TOC1" else "8946"
        ind = '<w:ind w:left="400"/>' if is_sub else ''
        p_xml = f'''<w:p><w:pPr><w:pStyle w:val="{style}"/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="{tab_pos}"/></w:tabs><w:spacing w:before="120" w:after="40"/>{ind}</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>{title.replace("&", "&amp;")}</w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="22"/></w:rPr><w:t>{page}</w:t></w:r></w:p>'''
        new_sdt_paragraphs.append(p_xml)

    joined_new_toc = ''.join(new_sdt_paragraphs)

    # Replace existing w:sdtContent children with new paragraphs
    sdt_content_match = re.search(r'(<w:sdtContent>)(.*?)(</w:sdtContent>)', xml_content, re.DOTALL)
    if sdt_content_match:
        xml_content = xml_content[:sdt_content_match.start(2)] + joined_new_toc + xml_content[sdt_content_match.end(2):]
        with open(doc_xml_path, 'w', encoding='utf-8') as f:
            f.write(xml_content)
        print("TOC successfully updated in document.xml.")

    # Re-zip
    with zipfile.ZipFile(docx_file, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, temp_dir)
                z_out.write(full_path, rel_path)
    shutil.rmtree(temp_dir)
    print("Document repacked successfully!")

if __name__ == '__main__':
    main()
