import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
  slug?: { current?: string }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 })
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true // Wait for CDN propagation
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    const revalidated: string[] = []

    // For settings, revalidate all pages (they affect the whole site)
    if (body._type === 'settings') {
      revalidatePath('/', 'layout')
      revalidated.push('all pages')
    }

    // For pages, revalidate the specific page and home
    if (body._type === 'page') {
      revalidatePath('/', 'layout')
      if (body.slug?.current && body.slug.current !== 'home') {
        revalidatePath(`/${body.slug.current}`)
        revalidated.push(`/${body.slug.current}`)
      }
      revalidated.push('/')
    }

    return NextResponse.json({
      success: true,
      revalidated,
      message: `Revalidated: ${revalidated.join(', ')}`
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return new Response((err as Error).message, { status: 500 })
  }
}
