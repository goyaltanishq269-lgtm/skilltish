import os
import zipfile
import re
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

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

def add_body_p(doc, text, bold_prefix="", bullet=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph(style='Body Text')
    set_para_format(p, align=align, line_spacing=1.5, space_before_pt=0, space_after_pt=6)
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_run_font(r_pre, name='Times New Roman', size_pt=12, bold=True)
    r_body = p.add_run(text)
    set_run_font(r_body, name='Times New Roman', size_pt=12, bold=False)
    if bullet:
        p.paragraph_format.left_indent = Inches(0.25)
    return p

def add_code_block(doc, lines):
    for line in lines:
        p = doc.add_paragraph()
        set_para_format(p, align=WD_ALIGN_PARAGRAPH.LEFT, line_spacing=1.15, space_before_pt=0, space_after_pt=2)
        p.paragraph_format.left_indent = Inches(0.4)
        r = p.add_run(line)
        set_run_font(r, name='Courier New', size_pt=10, bold=False)

def main():
    doc = docx.Document(DOCX_IN)
    
    # 1. Update Cover Page (Paragraphs 0 to 33)
    # P9, P10, P11
    doc.paragraphs[9].text = "SKILL ENHANCEMENT COURSE-II"
    doc.paragraphs[10].text = "AI POWERED FULL STACK DEVELOPMENT"
    doc.paragraphs[11].text = "PROJECT REPORT ON:\nSKILLTISH: A MICRO-INTERNSHIP SPRINT ENGINE WITH CRYPTOGRAPHIC PROOF-OF-WORK CREDENTIALS"
    for r in doc.paragraphs[11].runs:
        set_run_font(r, name='Times New Roman', size_pt=15, bold=True)
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

    # 2. Update Certificate Page (Paragraphs 34 to 60)
    cert_text = (
        "This is to certify that the project work titled “SKILLTISH: A MICRO-INTERNSHIP SPRINT "
        "ENGINE WITH CRYPTOGRAPHIC PROOF-OF-WORK CREDENTIALS” is a bonafide work carried out by "
        "Tanishq Goyal (USN: ENG25CS0822), a bonafide student of the 3rd Semester, 2nd Year (Section L) "
        "of Bachelor of Technology in Computer Science and Engineering at the School of Engineering, "
        "Dayananda Sagar University, Bangalore, in partial fulfillment of the requirements for the "
        "course Skill Enhancement Course-II: AI Powered Full Stack Development during the academic year 2026–2027."
    )
    doc.paragraphs[40].text = cert_text
    set_para_format(doc.paragraphs[40], align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=12, space_after_pt=18)
    for r in doc.paragraphs[40].runs:
        set_run_font(r, name='Times New Roman', size_pt=12, bold=False)
        
    doc.paragraphs[41].text = ""
    doc.paragraphs[42].text = ""
    
    # Signatures block
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

    # 3. Update Declaration Page (Paragraphs 61 to 78)
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
    set_para_format(doc.paragraphs[63], align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.5, space_before_pt=12, space_after_pt=18)
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

    # Save intermediate document
    doc.save(DOCX_OUT)
    print("Base document saved.")

if __name__ == '__main__':
    main()
