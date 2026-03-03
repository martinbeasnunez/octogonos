import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Octógonos de candidatos + IA';
export const size = { width: 1200, height: 630 };
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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated accent elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(230, 57, 70, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '-50%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(230, 57, 70, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            textAlign: 'center',
            paddingLeft: '60px',
            paddingRight: '60px',
          }}
        >
          {/* Top badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              backgroundColor: 'rgba(230, 57, 70, 0.15)',
              padding: '12px 24px',
              borderRadius: '999px',
              border: '1px solid rgba(230, 57, 70, 0.3)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#E63946',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#E63946',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Elecciones 2026
            </span>
          </div>

          {/* Main title */}
          <h1
            style={{
              fontSize: '96px',
              fontWeight: '900',
              color: '#FFFFFF',
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em',
              lineHeight: '0.9',
            }}
          >
            Octógonos
          </h1>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#9CA3AF',
              }}
            >
              de candidatos
            </span>
            <span
              style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#E63946',
              }}
            >
              + IA
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: '24px',
              color: '#D1D5DB',
              margin: '0 0 48px 0',
              maxWidth: '900px',
              lineHeight: '1.4',
            }}
          >
            Toda la info de cada candidato en un lugar. Educación, historial legal y plan de gobierno — con fuentes oficiales y análisis de IA.
          </p>

          {/* Bottom bar with red accent */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '4px',
                backgroundColor: '#E63946',
                borderRadius: '2px',
              }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#9CA3AF',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              VORAZ
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
