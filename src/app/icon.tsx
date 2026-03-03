import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #E63946 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '140px',
            fontWeight: '900',
            color: '#FFFFFF',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            letterSpacing: '-0.05em',
            margin: 0,
            lineHeight: 1,
          }}
        >
          O
        </div>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
