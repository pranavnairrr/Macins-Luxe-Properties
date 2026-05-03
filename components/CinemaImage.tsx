import NextImage, { type ImageProps } from 'next/image'

// Brand-navy 1×1 pixel blur placeholder for all remote images.
// Next.js cannot auto-generate blurDataURL for remote URLs — this prevents
// the white flash on load and keeps the dark luxury feel during transitions.
const NAVY_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk' +
  'YPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

type Props = ImageProps & {
  cinema?: boolean  // true = quality 90 (hero / full-bleed shots)
}

export default function CinemaImage({
  cinema = false,
  quality,
  blurDataURL,
  ...props
}: Props) {
  return (
    <NextImage
      quality={quality ?? (cinema ? 90 : 85)}
      placeholder="blur"
      blurDataURL={blurDataURL ?? NAVY_BLUR}
      {...props}
    />
  )
}
