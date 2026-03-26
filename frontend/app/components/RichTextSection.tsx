'use client'

import {PortableText, PortableTextComponents} from 'next-sanity'
import {stegaClean} from 'next-sanity'
import Button, {ButtonGroup} from './Button'

type RichTextSectionProps = {
  block: {
    _key: string
    _type: 'richTextSection'
    sectionId?: string
    title?: string
    body?: any[]
    buttons?: any[]
  }
  index: number
  pageId: string
  pageType: string
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({children}) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>
    ),
    h4: ({children}) => (
      <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{children}</h4>
    ),
    normal: ({children}) => (
      <p className="text-lg text-gray-600 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({children}) => <strong className="font-bold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    underline: ({children}) => <span className="underline">{children}</span>,
    link: ({children, value}) => {
      const href = value?.anchor ? `#${value.anchor}` : value?.href || '#'
      const isAnchor = !!value?.anchor

      if (isAnchor) {
        return (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={(e) => {
              e.preventDefault()
              const target = document.querySelector(href)
              if (target) {
                target.scrollIntoView({behavior: 'smooth'})
              }
            }}
          >
            {children}
          </a>
        )
      }

      return (
        <a
          href={href}
          className="text-blue-600 hover:text-blue-800 underline"
          target={value?.openInNewTab ? '_blank' : undefined}
          rel={value?.openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({children}) => (
      <ul className="list-disc list-inside text-lg text-gray-600 mb-4 space-y-2">{children}</ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal list-inside text-lg text-gray-600 mb-4 space-y-2">{children}</ol>
    ),
  },
  types: {
    button: ({value}) => (
      <div className="my-6">
        <Button {...value} />
      </div>
    ),
  },
}

export default function RichTextSection({block}: RichTextSectionProps) {
  const {sectionId, title, body, buttons} = block

  return (
    <section
      id={stegaClean(sectionId) || undefined}
      className="py-16 lg:py-24"
    >
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {title}
            </h2>
          )}

          {body && body.length > 0 && (
            <div className="prose prose-lg max-w-none">
              <PortableText value={body} components={portableTextComponents} />
            </div>
          )}

          {buttons && buttons.length > 0 && (
            <div className="mt-8">
              <ButtonGroup buttons={buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
