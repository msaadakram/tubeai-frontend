import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #ff1a1a 0%, #cc0000 60%, #880000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* White circle */}
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
        >
          {/* Play triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '26px solid transparent',
              borderBottom: '26px solid transparent',
              borderLeft: '44px solid #cc0000',
              marginLeft: 8,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
