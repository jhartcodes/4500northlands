'use client'

import CustomPortableText from '@/app/components/PortableText'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'
import Accordion, {AccordionItem} from '@/app/components/ui/Accordion'

type FAQItem = {
  _key: string
  question?: string
  answer?: any[]
}

type FAQBlockProps = {
  block: {
    _key: string
    _type: 'faqBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    title?: string
    items?: FAQItem[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function FAQBlock({block}: FAQBlockProps) {
  const {sectionId, background, title, items} = block

  const isDark = isDarkBackground(background)
  const textColor = isDark ? 'text-white' : 'text-navy'

  if (!items || items.length === 0) return null

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {title && (
            <h2 className={`font-display text-3xl md:text-4xl font-bold mb-8 text-center ${textColor}`}>
              {title}
            </h2>
          )}

          <Accordion>
            {items.map((item, index) => (
              <AccordionItem
                key={item._key}
                heading={item.question || `Question ${index + 1}`}
                isDark={isDark}
              >
                {item.answer && item.answer.length > 0 && (
                  <CustomPortableText value={item.answer} isDark={isDark} />
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SectionWrapper>
  )
}
