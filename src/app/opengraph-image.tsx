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
    <div
      style={{
        fontSize: 128,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #E63946 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        color: 'white',
      }}
    >
      <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
        Octógonos
      </div>
      <div style={{ fontSize: 56, fontWeight: 'bold', marginBottom: 40, color: '#FFE4E1' }}>
        de candidatos + IA
      </div>
      <div
        style={{
          fontSize: 32,
          textAlign: 'center',
          marginBottom: 50,
          maxWidth: 900,
          lineHeight: 1.4,
        }}
      >
        Toda la información de cada candidato presidencial 2026
      </div>
      <div style={{ fontSize: 24, color: '#B0B0B0' }}>
        Educación • Legal • Plan de Gobierno
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
