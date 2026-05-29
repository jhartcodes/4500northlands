import {GetPageQueryResult} from '@/sanity.types'
import type {PortableTextBlock} from 'next-sanity'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

export type PageBuilderSection = NonNullable<NonNullable<GetPageQueryResult>['pageBuilder']>[number]
export type ExtractPageBuilderType<T extends PageBuilderSection['_type']> = Extract<
  PageBuilderSection,
  {_type: T}
>

export type CmsImage = SanityImageSource & {
  alt?: string | null
  caption?: string | null
  _key?: string
}

export type CmsPortableText = PortableTextBlock[]

export type CmsButton = {
  _key?: string
  label?: string
  href?: string
  variant?: 'primary' | 'forest' | 'outlineWhite' | 'outlineDark'
  openInNewTab?: boolean
}

// Represents a Link after GROQ dereferencing (page becomes slug string)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'anchor' | 'page'
  href?: string
  anchor?: string
  page?: string | null
  openInNewTab?: boolean
}
