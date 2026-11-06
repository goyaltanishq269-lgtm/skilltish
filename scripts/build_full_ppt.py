import os
import zipfile
import tempfile
import shutil
import re
import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

SRC_PPTX = '/Users/tanishqgoyal/Desktop/sec/sample_ppt.pptx'
OUT_PPTX = '/Users/tanishqgoyal/Desktop/sec/sample ppt.pptx'

def set_font(run, name='Calibri', size_pt=16, bold=False, rgb=(15, 23, 42)):
    run.font.name = name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    if rgb:
        run.font.color.rgb = RGBColor(*rgb)

def prepare_10_slides(src, dst):
    temp_dir = tempfile.mkdtemp()
    with zipfile.ZipFile(src, 'r') as z:
        z.extractall(temp_dir)

    # slide3 has the perfect layout and elements
    # copy slide3 to slide10
    shutil.copyfile(os.path.join(temp_dir, 'ppt/slides/slide3.xml'), os.path.join(temp_dir, 'ppt/slides/slide10.xml'))
    shutil.copyfile(os.path.join(temp_dir, 'ppt/slides/_rels/slide3.xml.rels'), os.path.join(temp_dir, 'ppt/slides/_rels/slide10.xml.rels'))

    # Update [Content_Types].xml
    ct_path = os.path.join(temp_dir, '[Content_Types].xml')
    with open(ct_path, 'r', encoding='utf-8') as f:
        ct_xml = f.read()
    if 'slide10.xml' not in ct_xml:
        ct_xml = ct_xml.replace('</Types>', '<Override PartName="/ppt/slides/slide10.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>')
        with open(ct_path, 'w', encoding='utf-8') as f:
            f.write(ct_xml)

    # Update presentation.xml.rels
    pres_rels_path = os.path.join(temp_dir, 'ppt/_rels/presentation.xml.rels')
    with open(pres_rels_path, 'r', encoding='utf-8') as f:
        pres_rels_xml = f.read()
    rids = [int(m) for m in re.findall(r'rId(\d+)', pres_rels_xml)]
    new_rid = f'rId{max(rids) + 1}'
    if 'slide10.xml' not in pres_rels_xml:
        new_rel = f'<Relationship Id="{new_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide10.xml"/>'
        pres_rels_xml = pres_rels_xml.replace('</Relationships>', f'{new_rel}</Relationships>')
        with open(pres_rels_path, 'w', encoding='utf-8') as f:
            f.write(pres_rels_xml)

    # Update presentation.xml
    pres_path = os.path.join(temp_dir, 'ppt/presentation.xml')
    with open(pres_path, 'r', encoding='utf-8') as f:
        pres_xml = f.read()
    s_ids = [int(m) for m in re.findall(r'<p:sldId [^>]*id="(\d+)"', pres_xml)]
    new_sid = max(s_ids) + 1
    if new_rid not in pres_xml:
        pres_xml = pres_xml.replace('</p:sldIdLst>', f'<p:sldId id="{new_sid}" r:id="{new_rid}"/></p:sldIdLst>')
        with open(pres_path, 'w', encoding='utf-8') as f:
            f.write(pres_xml)

    with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, temp_dir)
                z_out.write(full_path, rel_path)
    shutil.rmtree(temp_dir)

def populate_presentation():
    prepare_10_slides(SRC_PPTX, OUT_PPTX)
    prs = pptx.Presentation(OUT_PPTX)

    # Slide 1: TITLE SLIDE
    s1 = prs.slides[0]
    # Shape 4: Department
    s1.shapes[4].text_frame.text = "Department of Computer Science & Engineering"
    p = s1.shapes[4].text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    set_font(p.runs[0], name='Calibri', size_pt=26, bold=True, rgb=(13, 13, 71))

    # Shape 3: Course
    s1.shapes[3].text_frame.text = "Skill Enhancement Course-II: AI Powered Full Stack Development"
    p = s1.shapes[3].text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    set_font(p.runs[0], name='Calibri', size_pt=20, bold=True, rgb=(0, 112, 192))

    # Shape 1: Title and Subtitle
    s1.shapes[1].text_frame.text = ""
    p1 = s1.shapes[1].text_frame.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    r1 = p1.add_run()
    r1.text = "SKILLTISH ⚡\n"
    set_font(r1, name='Calibri', size_pt=28, bold=True, rgb=(0, 0, 0))
    p2 = s1.shapes[1].text_frame.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    r2 = p2.add_run()
    r2.text = "A Micro-Internship Sprint Engine with Cryptographic Proof-of-Work Credentials"
    set_font(r2, name='Calibri', size_pt=18, bold=True, rgb=(66, 4, 8))

    # Shape 5: Supervision
    s1.shapes[5].text_frame.text = ""
    p = s1.shapes[5].text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "Under the supervision of:\nCourse Faculty / Project Coordinator\nDept. of Computer Science & Engineering"
    set_font(r, name='Calibri', size_pt=17, bold=True, rgb=(0, 50, 23))

    # Shape 2: Presenter
    s1.shapes[2].text_frame.text = ""
    p = s1.shapes[2].text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "Presented By:\nTANISHQ GOYAL (ENG25CS0822)\n2nd Year, 3rd Semester, Section L (Roll No: 13)\nLive Platform: https://skilltish-laur.vercel.app"
    set_font(r, name='Calibri', size_pt=17, bold=True, rgb=(15, 23, 42))

    slides_content = [
        # SLIDE 2
        (
            "PROJECT SCOPE & CLARITY",
            [
                ("Target Beneficiaries:", True, 0),
                ("• Student Developers: Build verifiable, auditable engineering proof-of-work records rather than tutorial clones.", False, 1),
                ("• Early-Stage Tech Ventures: Delegate modular backlog tasks and screen engineering capability with zero hiring overhead.", False, 1),
                ("Expected Outcomes:", True, 0),
                ("• Eliminates resume-screening false positives by anchoring verified skills in merged pull requests.", False, 1),
                ("• Generates non-repudiable, tamper-evident cryptographic badges with SHA-256 digests in real time.", False, 1),
                ("Core Technology Stack:", True, 0),
                ("• Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, MongoDB Atlas Cloud Cluster.", False, 1),
                ("Operating Constraints:", True, 0),
                ("• Scoped sprints strictly bounded between 24 hours and 7 days to preserve fast feedback loops.", False, 1),
            ]
        ),
        # SLIDE 3
        (
            "PROBLEM DEFINITION & MOTIVATION",
            [
                ("The Trust Deficit in Hiring:", True, 0),
                ("• Over 80% of early-career resumes feature unverified skills, generic self-assessments, and copied GitHub repositories.", False, 1),
                ("Screening Fatigue for Startups:", True, 0),
                ("• Technical founders and engineering managers spend dozens of hours reviewing take-home assignments that fail to test production readiness.", False, 1),
                ("Binary Internship Credentialing:", True, 0),
                ("• Conventional 3-month summer internship letters confirm attendance rather than code quality, architecture, or speed.", False, 1),
                ("Our Core Objective:", True, 0),
                ("• Replace self-reported claims with an immutable, cryptographically verifiable proof-of-work sprint ecosystem.", False, 1),
            ]
        ),
        # SLIDE 4
        (
            "LITERATURE SURVEY & BENCHMARKING",
            [
                ("Traditional Job Boards (LinkedIn, Indeed):", True, 0),
                ("• Rely exclusively on unverified self-reporting; vulnerable to AI embellishment and credential inflation.", False, 1),
                ("Coding Platforms (LeetCode, HackerRank):", True, 0),
                ("• Assess algorithmic time complexity in isolation, ignoring version control, modular system design, and API engineering.", False, 1),
                ("Open Source Bounty Boards (Gitcoin, IssueHunt):", True, 0),
                ("• Feature steep onboarding curves and lack structured mentorship suitable for early-career undergraduates.", False, 1),
                ("SkillTish Innovation:", True, 0),
                ("• Curated, time-bounded micro-sprints integrated with an in-app diff reviewer and cryptographic credentialing.", False, 1),
            ]
        ),
        # SLIDE 5
        (
            "DETAILED DESIGN & SYSTEM ARCHITECTURE",
            [
                ("Dual-Persona Workflow:", True, 0),
                ("• Startups publish backlog tickets with specifications, acceptance criteria, and timeframes.", False, 1),
                ("• Students browse the live feed, claim tickets based on preferred tech stacks, and submit GitHub PRs.", False, 1),
                ("Full-Stack Architecture:", True, 0),
                ("• Client UI (React Server Components) ➔ Server Actions / Route Handlers ➔ Mongoose Schemas ➔ MongoDB Atlas Cloud Cluster.", False, 1),
                ("Cryptographic Engine:", True, 0),
                ("• SHA-256 digest computation encoding Student_ID, Task_ID, Commit_SHA, and Timestamp upon reviewer approval.", False, 1),
            ]
        ),
        # SLIDE 6
        (
            "IMPLEMENTATION APPROACH & KEY INNOVATIONS",
            [
                ("In-App Code Review Drawer:", True, 0),
                ("• Slide-over reviewer interface allowing technical evaluators to inspect diffs without leaving the dashboard.", False, 1),
                ("3D Holographic Credentials:", True, 0),
                ("• Framer Motion components supporting cursor-responsive perspective tilt (rotateX, rotateY) and dynamic specular sheen.", False, 1),
                ("Procedural Web Audio Engine:", True, 0),
                ("• Native Web Audio API oscillators synthesizing tactile clicks and harmonic minting chimes without external MP3 files.", False, 1),
                ("Evaluator Switching Dock:", True, 0),
                ("• Persistent bottom dock for instant, one-click persona switching between Student (Alex) and Reviewer (Priya).", False, 1),
            ]
        ),
        # SLIDE 7
        (
            "CRYPTOGRAPHIC VERIFICATION PIPELINE",
            [
                ("Digest Computation Formula:", True, 0),
                ("• Proof_Hash = 'SKL-' + SHA256(studentId + taskId + commitSha + timestamp).slice(0, 16).toUpperCase()", False, 1),
                ("Public Audit Endpoint:", True, 0),
                ("• Resolves at /verify/[hash] (e.g. /verify/SKL-8492-NEXTJS) to display an authoritative audit certificate.", False, 1),
                ("Tamper-Evident Security:", True, 0),
                ("• Any modification to student identity, project requirements, or commit hash immediately invalidates the signature.", False, 1),
            ]
        ),
        # SLIDE 8
        (
            "DEMONSTRATION & EVALUATOR FLOW",
            [
                ("1. Discover & Claim:", True, 0),
                ("• Student (Alex) logs in via the evaluator dock, browses /feed, filters by tech stack, and claims a task.", False, 1),
                ("2. PR Submission:", True, 0),
                ("• Student submits repository link, pull request URL, commit SHA, and technical implementation notes.", False, 1),
                ("3. Code Review & Approval:", True, 0),
                ("• Company (Priya) inspects the diff in the slide-over code drawer and clicks 'Approve & Issue Badge'.", False, 1),
                ("4. Badge Minting & Audit:", True, 0),
                ("• Procedural chimes trigger, confetti fires, and the immutable certificate renders with dynamic 3D tilt.", False, 1),
            ]
        ),
        # SLIDE 9
        (
            "RESULTS, VALIDATION & IMPACT",
            [
                ("Live Production Deployment:", True, 0),
                ("• Fully operational and live on the Vercel Edge Network at https://skilltish-laur.vercel.app.", False, 1),
                ("Cloud Database Initialization:", True, 0),
                ("• MongoDB Atlas AWS Mumbai cluster successfully seeded with demo backlog tickets and test profiles.", False, 1),
                ("Sub-300ms Evaluation Latency:", True, 0),
                ("• Evaluator dock enables instantaneous testing and verification of student and startup workflows.", False, 1),
                ("Practical Competence Proof:", True, 0),
                ("• Replaces abstract whiteboard trivia with genuine production-grade deliverables.", False, 1),
            ]
        ),
        # SLIDE 10
        (
            "CONCLUSION & FUTURE SCOPE",
            [
                ("Summary:", True, 0),
                ("• SkillTish bridges academia and industry by turning student contributions into verifiable, cryptographic proof-of-work.", False, 1),
                ("Automated GitHub Webhooks:", True, 0),
                ("• Integrate automated GitHub Webhook listeners for continuous integration and automated test validation.", False, 1),
                ("In-App Diff Rendering:", True, 0),
                ("• Native rendering of multi-file Git diffs via GitHub REST and GraphQL APIs.", False, 1),
                ("On-Chain Verification:", True, 0),
                ("• Anchoring credential hashes on Ethereum Layer-2 networks (Polygon/Arbitrum) for permanent immutability.", False, 1),
            ]
        ),
    ]

    for idx, (title, items) in enumerate(slides_content):
        slide = prs.slides[idx + 1]

        # Update Slide Title
        title_shape = slide.shapes[0]
        title_shape.text_frame.text = title
        p_t = title_shape.text_frame.paragraphs[0]
        p_t.alignment = PP_ALIGN.CENTER
        set_font(p_t.runs[0], name='Calibri', size_pt=22, bold=True, rgb=(0, 122, 166))

        # Update Footer & Date & Slide Number
        for sp in slide.shapes:
            if sp.has_text_frame:
                txt = sp.text_frame.text.strip()
                if 'Dept of CSE' in txt:
                    sp.text_frame.text = "Dept of CSE., SOE - Dayananda Sagar University"
                    set_font(sp.text_frame.paragraphs[0].runs[0], name='Calibri', size_pt=11, bold=False, rgb=(100, 116, 139))
                elif '11/4' in txt:
                    sp.text_frame.text = "11/04/26"
                    set_font(sp.text_frame.paragraphs[0].runs[0], name='Calibri', size_pt=11, bold=False, rgb=(100, 116, 139))
                elif 'Slide Number' in sp.name:
                    sp.text_frame.text = f"{idx + 2} of 10"
                    set_font(sp.text_frame.paragraphs[0].runs[0], name='Calibri', size_pt=11, bold=False, rgb=(100, 116, 139))

        # Remove any existing placeholder body shapes
        body_shapes_to_remove = [sp for sp in slide.shapes if sp.has_text_frame and sp != title_shape and not any(k in sp.text_frame.text for k in ['Dept of CSE', '11/04', '11/4', 'of 10'])]
        for sp in body_shapes_to_remove:
            sp._element.getparent().remove(sp._element)

        # Add nicely styled content box
        tb = slide.shapes.add_textbox(Inches(1.5), Inches(1.65), Inches(7.2), Inches(4.8))
        tf = tb.text_frame
        tf.word_wrap = True

        for p_idx, (text, is_header, level) in enumerate(items):
            p = tf.paragraphs[0] if p_idx == 0 else tf.add_paragraph()
            p.text = text
            if is_header:
                p.space_before = Pt(8)
                p.space_after = Pt(2)
                set_font(p.runs[0], name='Calibri', size_pt=15, bold=True, rgb=(15, 23, 42))
            else:
                p.space_before = Pt(2)
                p.space_after = Pt(4)
                set_font(p.runs[0], name='Calibri', size_pt=13.5, bold=False, rgb=(51, 65, 85))

    prs.save(OUT_PPTX)
    print("Populated 10-slide presentation successfully!")

if __name__ == '__main__':
    populate_presentation()
