export function BrandIcon({ name, size = 24 }) {
  if (name === 'messenger') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.15 2 11.27c0 2.9 1.44 5.49 3.71 7.19V22l3.39-1.86c.9.25 1.87.39 2.9.39 5.52 0 10-4.15 10-9.26C22 6.15 17.52 2 12 2zm1.03 12.47-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.92-2.72-5.48 5.82z" fill="currentColor" />
      </svg>
    )
  }

  return <img src="/images/zalo-logo.png" alt="" aria-hidden="true" style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%' }} />
}