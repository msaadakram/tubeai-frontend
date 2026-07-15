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
          borderRadius: 36,
          background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* YT-style play button */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: '38px solid transparent',
            borderBottom: '38px solid transparent',
            borderLeft: '62px solid white',
            marginLeft: 12,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
