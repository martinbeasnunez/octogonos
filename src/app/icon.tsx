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
          background: 'linear-gradient(135deg, #0f172a 0%, #E63946 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '60px',
            fontWeight: '900',
            color: '#FFFFFF',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em',
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
