import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #ff1a1a 0%, #cc0000 60%, #990000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      >
        {/* White circle background for play button */}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Play triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '8px solid #cc0000',
              marginLeft: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
