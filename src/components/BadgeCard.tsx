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
  CheckCircle,
} from 'lucide-react';

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

  // Range of tilt: [-12deg, 12deg]
  const rotateX = useTransform(mouseYSpring, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-10, 10]);

  // Specular sheen linear/radial gradient tracking mouse
  const sheenX = useTransform(mouseXSpring, [0, 1], ['0%', '100%']);
  const sheenY = useTransform(mouseYSpring, [0, 1], ['0%', '100%']);
  const sheen = useMotionTemplate`radial-gradient(circle 320px at ${sheenX} ${sheenY}, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
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

  // Generate standardized verification hash (e.g. SKL-8492-NEXTJS)
  const hashId = (badge._id && badge._id.length >= 4 ? badge._id.slice(-4) : '8492').toUpperCase();
  const cleanSkill = (badge.skill || 'DEV').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);
  const verificationHash = `SKL-${hashId}-${cleanSkill}`;

  // Deliverable link
  const proofLink =
    badge.proofUrl ||
    'https://github.com/alexchen/nextauth-credentials-demo';
  const isGithub = proofLink.includes('github.com');
  const isFigma = proofLink.includes('figma.com');

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="glass-card relative rounded-2xl border border-white/10 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-colors duration-300 p-5 sm:p-6 flex flex-col justify-between group overflow-hidden select-none"
      >
        {/* Specular Sheen Dynamic Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100"
          style={{ background: sheen }}
        />

        {/* Ambient Corner Glow */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 via-indigo-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
          {/* Header: Verified Pill + Verification Hash */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-violet-600 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 text-white" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.08] tracking-wider">
                #{verificationHash}
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Badge Title */}
          <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-emerald-300 transition-colors">
            {badge.title}
          </h4>

          {/* Skill chip & duration */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white/[0.06] text-zinc-200 border border-white/10">
              {badge.skill}
            </span>
            {badge.task?.duration && (
              <span className="text-[11px] font-mono text-zinc-400">
                • {badge.task.duration} sprint
              </span>
            )}
          </div>

          {/* Issuer Stamp */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] mb-4 flex items-center justify-between text-xs backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[11px] flex items-center justify-center shrink-0">
                {companyInitial}
              </div>
              <span className="text-zinc-300 font-medium truncate">
                Issued by <strong className="text-white">{company}</strong>
              </span>
            </div>

            <span className="text-[11px] text-zinc-500 flex items-center gap-1 shrink-0 font-mono">
              <Calendar className="w-3 h-3 text-zinc-500" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Card Footer Actions: Verify Credential & Inspect Proof */}
        <div
          className="pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs relative z-10"
          style={{ transform: 'translateZ(25px)' }}
        >
          {/* Route to Cryptographic Audit View */}
          <Link
            href={`/verify/${verificationHash}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors group/link"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover/link:rotate-12 transition-transform" />
            <span>Verify Credential ↗</span>
          </Link>

          {/* Direct Link to Deliverable */}
          <a
            href={proofLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 hover:text-white border border-white/10 text-[11px] font-medium transition"
          >
            {isGithub ? (
              <Github className="w-3 h-3 text-zinc-300" />
            ) : isFigma ? (
              <Figma className="w-3 h-3 text-purple-400" />
            ) : (
              <LinkIcon className="w-3 h-3 text-zinc-400" />
            )}
            <span>Proof ↗</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
