import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

/**
 * THROWAWAY PROTOTYPE — not linked from the site, not in the page builder.
 *
 * Compares the two caption treatments and the two height options for the
 * proposed Image block, using the five images that are live on the home page
 * today. Delete this route once a direction is chosen.
 */

export const metadata = {title: 'Image block — caption prototype', robots: {index: false}}

// The five images currently rendered by fullWidthImageBlock on the home page.
const PLAZA = 'image-b1fb1bb392570193c5438d7eddbf4aa1289c7634-1280x432-png' // 2.96:1 diagram, white ground
const HEIGHTS = 'image-182a3099fef5b5ae6cab11ccc885c84303729e26-1280x432-png' // 2.96:1 diagram, white ground
const ROOFTOP = 'image-0f83453bc1fb9042109b6fe034ee73266d122603-1277x702-png' // 1.82:1 render
const AERIAL = 'image-8beaf472dadda92dcca8bc22f666662d24f37ada-5000x3750-jpg' // 1.33:1 photo

const heightClasses = {
  short: 'aspect-[21/9] md:aspect-[3/1]', // today's behaviour — 480px tall at 1440
  tall: 'aspect-[4/3] md:aspect-[16/9]', // 810px tall at 1440
  natural: '', // no crop at all — image sets its own height
} as const

type Height = keyof typeof heightClasses

function src(ref: string, width = 1920) {
  return urlForImage({_type: 'image', asset: {_type: 'reference', _ref: ref}})
    ?.width(width)
    .quality(80)
    .auto('format')
    .url()
}

/** Option A — caption sits on the image over a gradient scrim. No added height. */
function CaptionOnImage({
  imageRef,
  kicker,
  caption,
  height = 'short',
}: {
  imageRef: string
  kicker?: string
  caption: string
  height?: Height
}) {
  const url = src(imageRef)
  if (!url) return null

  return (
    <div className={`relative w-full overflow-hidden ${heightClasses[height]}`}>
      {height === 'natural' ? (
        <Image src={url} alt="" width={1920} height={1080} className="w-full h-auto" />
      ) : (
        <Image src={url} alt="" fill className="object-cover" sizes="100vw" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 content-padding pb-6 md:pb-10">
        <div className="max-w-3xl">
          {kicker && (
            <p className="text-xs md:text-sm uppercase tracking-widest text-gold font-semibold mb-1.5">
              {kicker}
            </p>
          )}
          <p className="font-display text-white text-lg md:text-2xl lg:text-3xl font-bold leading-snug">
            {caption}
          </p>
        </div>
      </div>
    </div>
  )
}

/** Option B — caption sits below the image. Adds vertical space. */
function CaptionBelowImage({
  imageRef,
  kicker,
  caption,
  height = 'short',
}: {
  imageRef: string
  kicker?: string
  caption: string
  height?: Height
}) {
  const url = src(imageRef)
  if (!url) return null

  return (
    <figure className="w-full">
      <div className={`relative w-full overflow-hidden ${heightClasses[height]}`}>
        {height === 'natural' ? (
          <Image src={url} alt="" width={1920} height={1080} className="w-full h-auto" />
        ) : (
          <Image src={url} alt="" fill className="object-cover" sizes="100vw" />
        )}
      </div>
      <figcaption className="content-padding pt-3 pb-1">
        <div className="max-w-3xl">
          {kicker && (
            <span className="text-xs uppercase tracking-widest text-gold font-semibold mr-2">
              {kicker}
            </span>
          )}
          <span className="text-sm md:text-base text-navy/70 leading-relaxed">{caption}</span>
        </div>
      </figcaption>
    </figure>
  )
}

function Label({n, title, note}: {n: string; title: string; note?: string}) {
  return (
    <div className="content-padding pt-14 pb-4">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">{n}</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">{title}</h2>
        {note && <p className="mt-2 text-sm text-navy/60 leading-relaxed">{note}</p>}
      </div>
    </div>
  )
}

export default function ImageBlockPrototype() {
  return (
    <main className="bg-white pb-24">
      <div className="content-padding pt-16 pb-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-2">
            Prototype · not live
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
            Image block — caption &amp; height options
          </h1>
          <p className="text-base text-navy/70 leading-relaxed">
            Every image below is one that is live on the home page today. Captions read “Test
            caption” so the treatment is what you are judging, not the words. Resize the window —
            the mobile behaviour is where these differ most.
          </p>
        </div>
      </div>

      <Label
        n="A · on image"
        title="Caption on image — photo"
        note="Gradient scrim from navy. Costs no extra vertical space. Works because the bottom of this render is dark enough to carry white type."
      />
      <CaptionOnImage imageRef={ROOFTOP} kicker="The Rooftop" caption="Test caption" />

      <Label
        n="B · below image"
        title="Caption below image — photo"
        note="Same image, caption underneath. Adds roughly 60px of height and a band of white."
      />
      <CaptionBelowImage imageRef={ROOFTOP} kicker="The Rooftop" caption="Test caption" />

      <Label
        n="A · on image"
        title="Caption on image — diagram"
        note="The failure case. These comparison diagrams sit on white, so the scrim has to darken most of the image to make the type legible — and it dims the diagram content along with it."
      />
      <CaptionOnImage imageRef={PLAZA} kicker="Plaza comparison" caption="Test caption" />

      <Label
        n="B · below image"
        title="Caption below image — diagram"
        note="Same diagram, caption underneath. The diagram stays untouched."
      />
      <CaptionBelowImage imageRef={PLAZA} kicker="Plaza comparison" caption="Test caption" />

      <Label
        n="C"
        title="Height — short (today's setting)"
        note="aspect 21/9 on mobile, 3/1 from 768px up. 480px tall at a 1440px window. This is exactly what the five live images do now."
      />
      <CaptionBelowImage imageRef={AERIAL} caption="Test caption — short" height="short" />

      <Label
        n="D"
        title="Height — tall"
        note="aspect 4/3 on mobile, 16/9 from 768px up. 810px tall at 1440px. Shows far more of the photo."
      />
      <CaptionBelowImage imageRef={AERIAL} caption="Test caption — tall" height="tall" />

      <Label
        n="E"
        title="Height — natural (worth adding)"
        note="No crop at all. Today's forced 21/9 cuts 21% off the sides of these 1280×432 diagrams on mobile, which eats the edge labels. Natural is the only setting that shows the whole diagram."
      />
      <CaptionBelowImage
        imageRef={HEIGHTS}
        kicker="Height comparison"
        caption="Test caption — natural, uncropped"
        height="natural"
      />
    </main>
  )
}
