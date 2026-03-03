import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Octógonos de candidatos + IA - Elige informado';
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #E63946 100%)',
          fontFamily: '"Barlow Condensed", system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Large animated circles background */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255,255,255, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255, 0.1) 0%, transparent 70%)',
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
            zIndex: 10,
            textAlign: 'center',
            paddingLeft: '80px',
            paddingRight: '80px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '14px 28px',
              borderRadius: '9999px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              ⚡ Elecciones 2026
            </span>
          </div>

          {/* Main title - MASSIVE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '20px',
              lineHeight: '0.85',
            }}
          >
            <h1
              style={{
                fontSize: '120px',
                fontWeight: '900',
                color: '#FFFFFF',
                margin: '0',
                letterSpacing: '-0.03em',
                textShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              OCTÓGONOS
            </h1>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                marginTop: '12px',
              }}
            >
              <span
                style={{
                  fontSize: '56px',
                  fontWeight: '700',
                  color: '#E0E7FF',
                }}
              >
                de candidatos
              </span>
              <span
                style={{
                  fontSize: '64px',
                  fontWeight: '900',
                  color: '#FBBF24',
                  textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                }}
              >
                + IA
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: '80px',
              height: '6px',
              background: 'linear-gradient(90deg, #FBBF24 0%, #E63946 100%)',
              borderRadius: '3px',
              margin: '28px 0',
            }}
          />

          {/* Tagline - Bold & Clear */}
          <p
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#FFFFFF',
              margin: '0 0 32px 0',
              maxWidth: '1000px',
              lineHeight: '1.3',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Información de 36 candidatos. Educación, legal y viabilidad de planes.
          </p>

          {/* Features pills */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {['Fuentes Oficiales', 'Análisis IA', 'Datos Actuales'].map((feature) => (
              <div
                key={feature}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '10px 18px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                ✓ {feature}
              </div>
            ))}
          </div>

          {/* Bottom text */}
          <div
            style={{
              marginTop: '40px',
              fontSize: '14px',
              color: '#F0F9FF',
              fontWeight: '500',
              letterSpacing: '0.05em',
            }}
          >
            por VORAZ
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
