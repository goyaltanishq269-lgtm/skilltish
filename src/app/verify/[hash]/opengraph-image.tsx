import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SkillTish Verified Cryptographic Certificate';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { hash: string } }) {
  const hash = params?.hash || 'SKL-8492-NEXTJS';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: '#ffffff',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
          border: '10px solid #18181b',
          position: 'relative',
        }}
      >
        {/* Glow ambient background element */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '500px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 70%)',
          }}
        />

        {/* TOP BRAND HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#09090b',
                fontWeight: 900,
                fontSize: '24px',
              }}
            >
              ✓
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px', color: '#ffffff' }}>
                SkillTish
              </span>
              <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700, letterSpacing: '1px' }}>
                CRYPTOGRAPHIC AUDIT CERTIFICATE
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '999px',
              padding: '8px 20px',
              color: '#34d399',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '1px',
            }}
          >
            ● VERIFIED PROOF-OF-WORK
          </div>
        </div>

        {/* CENTER CREDENTIAL CARD */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '36px 44px',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#a1a1aa', fontWeight: 600, letterSpacing: '1.5px' }}>
              CERTIFICATE ID:
            </span>
            <span
              style={{
                fontSize: '15px',
                color: '#e4e4e7',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '4px 12px',
                borderRadius: '8px',
              }}
            >
              #{hash}
            </span>
          </div>

          <div style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1px', color: '#ffffff' }}>
            Next.js &amp; NextAuth Production Specialist
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginTop: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Recipient Engineer
              </span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#f4f4f5' }}>
                Alex Chen
              </span>
            </div>

            <div style={{ width: '2px', height: '36px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Verified By Startup
              </span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#818cf8' }}>
                DevStudio
              </span>
            </div>

            <div style={{ width: '2px', height: '36px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Integrity Hash
              </span>
              <span style={{ fontSize: '15px', fontFamily: 'monospace', color: '#34d399' }}>
                SHA-256 TAMPER-PROOF
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            fontSize: '13px',
            color: '#71717a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>SkillTish Proof Engine</span>
            <span>•</span>
            <span style={{ color: '#a1a1aa' }}>Engineered by Tanishq Goyal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
            <span>On-Chain Code Audit Verified</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
