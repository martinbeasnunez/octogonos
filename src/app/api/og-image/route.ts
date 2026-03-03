import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #E63946 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ⚡ Elecciones 2026
        </div>
        <h1 style={{ fontSize: 120, fontWeight: 900, color: '#FFFFFF', margin: 0, lineHeight: 1 }}>
          OCTÓGONOS
        </h1>
        <div style={{ fontSize: 56, fontWeight: 700, color: '#E0E7FF' }}>
          de candidatos + IA
        </div>
        <div style={{ fontSize: 28, fontWeight: 600, color: '#FFFFFF', textAlign: 'center', maxWidth: 900, lineHeight: 1.3, marginTop: 20 }}>
          Información de 36 candidatos. Educación, legal y viabilidad.
        </div>
        <div style={{ fontSize: 14, color: '#F0F9FF', fontWeight: 500, marginTop: 20 }}>
          por VORAZ
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
