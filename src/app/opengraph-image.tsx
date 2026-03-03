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
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #E63946 100%)',
        fontFamily: 'Arial',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 900, marginBottom: 20 }}>
        Octógonos
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 30, color: '#FFE4E1' }}>
        de candidatos + IA
      </div>
      <div style={{ fontSize: 28, marginBottom: 40 }}>
        Toda la información de cada candidato presidencial 2026
      </div>
      <div style={{ fontSize: 20, color: '#B0B0B0' }}>
        Educación • Legal • Plan de Gobierno
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
