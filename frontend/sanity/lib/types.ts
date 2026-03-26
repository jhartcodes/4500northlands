import {GetPageQueryResult} from '@/sanity.types'

export type PageBuilderSection = NonNullable<NonNullable<GetPageQueryResult>['pageBuilder']>[number]
export type ExtractPageBuilderType<T extends PageBuilderSection['_type']> = Extract<
  PageBuilderSection,
  {_type: T}
>

// Represents a Link after GROQ dereferencing (page becomes slug string)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'anchor' | 'page'
  href?: string
  anchor?: string
  page?: string | null
  openInNewTab?: boolean
}
