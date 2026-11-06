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
          backgroundColor: '#ffffff',
          color: '#0f172a',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
          border: '12px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {/* TOP BRAND HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '24px',
              }}
            >
              ✓
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>
                SkillTish
              </span>
              <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: 800, letterSpacing: '1px' }}>
                ENTERPRISE CRYPTOGRAPHIC CERTIFICATE
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '999px',
              padding: '8px 20px',
              color: '#1d4ed8',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '1px',
            }}
          >
            ● VERIFIED ON-CHAIN PROOF
          </div>
        </div>

        {/* CENTER CREDENTIAL CARD */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8fafc',
            border: '2px solid #cbd5e1',
            borderRadius: '24px',
            padding: '36px 44px',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 700, letterSpacing: '1.5px' }}>
              CERTIFICATE ID:
            </span>
            <span
              style={{
                fontSize: '15px',
                color: '#0f172a',
                fontFamily: 'monospace',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '4px 12px',
                borderRadius: '8px',
                fontWeight: 700,
              }}
            >
              #{hash}
            </span>
          </div>

          <div style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a' }}>
            Next.js &amp; NextAuth Production Specialist
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginTop: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                Recipient Engineer
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Alex Chen
              </span>
            </div>

            <div style={{ width: '2px', height: '36px', backgroundColor: '#cbd5e1' }} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                Verified By Startup
              </span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#1d4ed8' }}>
                DevStudio
              </span>
            </div>

            <div style={{ width: '2px', height: '36px', backgroundColor: '#cbd5e1' }} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                Integrity Hash
              </span>
              <span style={{ fontSize: '15px', fontFamily: 'monospace', color: '#059669', fontWeight: 700 }}>
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
            borderTop: '1px solid #e2e8f0',
            paddingTop: '20px',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600 }}>SkillTish Enterprise Proof Engine</span>
            <span>•</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Engineered by Tanishq Goyal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700 }}>
            <span>Verified Source Code Deliverable</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
