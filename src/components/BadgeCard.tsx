'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import {
  Award,
  ShieldCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  Github,
  Figma,
  Link as LinkIcon,
} from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

interface BadgeCardProps {
  badge: {
    _id: string;
    title: string;
    skill: string;
    issuedAt: string;
    companyName?: string;
    issuerName?: string;
    proofUrl?: string;
    taskId?: string;
    task?: {
      _id?: string;
      title?: string;
      duration?: string;
      companyName?: string;
    };
  };
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer Motion cursor-tracked 3D tilt coordinates
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 25 });

  // Range of tilt: [-8deg, 8deg]
  const rotateX = useTransform(mouseYSpring, [0, 1], [7, -7]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-7, 7]);

  // Subtle specular sheen radial gradient - Olive & Nature tint
  const sheenX = useTransform(mouseXSpring, [0, 1], ['0%', '100%']);
  const sheenY = useTransform(mouseYSpring, [0, 1], ['0%', '100%']);
  const sheen = useMotionTemplate`radial-gradient(circle 280px at ${sheenX} ${sheenY}, rgba(52, 68, 52, 0.08) 0%, rgba(255, 255, 255, 0) 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    playClickSound();
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const formattedDate = new Date(badge.issuedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const company = badge.companyName || badge.task?.companyName || 'DevStudio';
  const companyInitial = company[0] || 'D';

  // Standardized verification hash
  const hashId = (badge._id && badge._id.length >= 4 ? badge._id.slice(-4) : '8492').toUpperCase();
  const cleanSkill = (badge.skill || 'DEV').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
  const verificationHash = `SKL-${hashId}-${cleanSkill}`;

  const proofLink =
    badge.proofUrl ||
    'https://github.com/alexchen/nextauth-credentials-demo';
  const isGithub = proofLink.includes('github.com');
  const isFigma = proofLink.includes('figma.com');

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="bg-white/90 backdrop-blur-sm relative rounded-2xl border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] hover:border-[#CCD5C3] hover:shadow-[0_4px_20px_rgba(40,50,40,0.08)] hover:-translate-y-0.5 transition-all duration-200 ease-out p-5 sm:p-6 flex flex-col justify-between group overflow-hidden select-none text-[#1B241B]"
      >
        {/* Specular Sheen Dynamic Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-200 opacity-60 group-hover:opacity-100"
          style={{ background: sheen }}
        />

        <div className="relative z-10" style={{ transform: 'translateZ(15px)' }}>
          {/* Header: Verified Pill + Verification Hash */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] flex items-center justify-center text-[#F4F6F1] font-bold shadow-sm shadow-[#2D3B2D]/20">
              <Award className="w-5 h-5 text-[#D5DEC9]" />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2 py-0.5 rounded border border-[#DEE3D7] tracking-wider">
                #{verificationHash}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-[#374B35] bg-[#EEF2EB] border border-[#D5DEC9] px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-[#3E5239]" />
                Verified
              </span>
            </div>
          </div>

          {/* Badge Title */}
          <h4 className="font-semibold text-[#1B241B] tracking-tight text-base sm:text-lg mb-1.5 group-hover:text-[#3E5239] transition-colors">
            {badge.title}
          </h4>

          {/* Skill chip & duration */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
              {badge.skill}
            </span>
            {badge.task?.duration && (
              <span className="text-[11px] text-[#525E50] font-mono">
                • {badge.task.duration} challenge
              </span>
            )}
          </div>

          {/* Issuer Stamp */}
          <div className="p-3 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] mb-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-md bg-[#EEF2EB] text-[#374B35] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#D5DEC9]">
                {companyInitial}
              </div>
              <span className="text-[#525E50] truncate">
                Issued by <strong className="text-[#1B241B] font-semibold">{company}</strong>
              </span>
            </div>

            <span className="text-[11px] text-[#525E50] flex items-center gap-1 shrink-0 font-mono">
              <Calendar className="w-3 h-3 text-[#525E50]" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Card Footer Actions: Verify Credential & Inspect Proof */}
        <div
          className="pt-3.5 border-t border-[#E4E8DE] flex items-center justify-between gap-2 text-xs relative z-10"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Route to Cryptographic Audit View */}
          <Link
            href={`/verify/${verificationHash}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3E5239] hover:text-[#2D3B2D] transition-colors group/link"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover/link:rotate-12 transition-transform text-[#3E5239]" />
            <span>Verify Credential ↗</span>
          </Link>

          {/* Direct Link to Deliverable */}
          <a
            href={proofLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] hover:text-[#2D3B2D] text-[11px] font-medium transition shadow-sm"
          >
            {isGithub ? (
              <Github className="w-3 h-3 text-slate-700" />
            ) : isFigma ? (
              <Figma className="w-3 h-3 text-purple-600" />
            ) : (
              <LinkIcon className="w-3 h-3 text-slate-400" />
            )}
            <span>Proof ↗</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
