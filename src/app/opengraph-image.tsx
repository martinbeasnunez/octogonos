import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Octógonos de candidatos + IA';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #E63946 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#FFFFFF',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '72px',
            fontWeight: '900',
            marginBottom: '30px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Octógonos
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '40px',
            lineHeight: 1.2,
            color: '#FFE4E1',
          }}
        >
          de candidatos + IA
        </div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: '400',
            maxWidth: '900px',
            lineHeight: 1.5,
            marginBottom: '50px',
            color: '#E8E8E8',
          }}
        >
          Toda la información de cada candidato presidencial 2026 en un solo lugar
        </div>
        <div
          style={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '0.1em',
              }}
            >
              📚 EDUCACIÓN
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '0.1em',
              }}
            >
              ⚖️ LEGAL
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '0.1em',
              }}
            >
              📋 PLAN GOB.
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '16px',
            color: '#B0B0B0',
            letterSpacing: '0.05em',
          }}
        >
          Powered by VORAZ · Fuentes oficiales JNE
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
