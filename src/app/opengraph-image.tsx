import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = 'Octógonos de candidatos + IA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #E63946 100%)',
          fontFamily: 'Arial, sans-serif',
          color: 'white',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          Octógonos
        </div>
        <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 30, color: '#FFE4E1' }}>
          de candidatos + IA
        </div>
        <div style={{ fontSize: 28, marginBottom: 40, lineHeight: 1.4 }}>
          Toda la información de cada candidato presidencial 2026
        </div>
        <div style={{ fontSize: 20, color: '#B0B0B0' }}>
          Educación • Legal • Plan de Gobierno
        </div>
      </div>
    ),
    size
  );
}
