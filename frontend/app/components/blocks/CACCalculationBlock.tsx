'use client'

import type {CmsPortableText} from '@/sanity/lib/types'
import CustomPortableText from '@/app/components/PortableText'

type Step = {
  _key: string
  stepLabel?: string
  body?: CmsPortableText
}

type CACCalculationBlockProps = {
  block: {
    _key: string
    _type: 'cacCalculationBlock'
    sectionId?: string
    stepsTitle?: string
    steps?: Step[]
    formulaResidentialLabel?: string
    formulaResidentialSub?: string
    formulaHotelLabel?: string
    formulaHotelSub?: string
    formulaResultLabel?: string
  }
  index: number
  pageId: string
  pageType: string
}

export default function CACCalculationBlock({block}: CACCalculationBlockProps) {
  const {
    sectionId,
    stepsTitle,
    steps,
    formulaResidentialLabel,
    formulaResidentialSub,
    formulaHotelLabel,
    formulaHotelSub,
    formulaResultLabel,
  } = block

  return (
    <section id={sectionId || undefined} className="bg-white section-padding">
      <div className="container">
        {/* Steps Section */}
        {steps && steps.length > 0 && (
          <div className="bg-cream rounded-lg p-8 lg:p-12">
            {stepsTitle && (
              <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-8 text-center">
                {stepsTitle}
              </h3>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={step._key} className="bg-white p-6 rounded-lg">
                  <div className="w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-sm mb-4">
                    {index + 1}
                  </div>
                  {step.stepLabel && (
                    <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
                      {step.stepLabel}
                    </p>
                  )}
                  {step.body && step.body.length > 0 && <CustomPortableText value={step.body} />}
                </div>
              ))}
            </div>

            {/* Formula Visual */}
            {(formulaResidentialLabel || formulaHotelLabel || formulaResultLabel) && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
                {formulaResidentialLabel && (
                  <div className="bg-white p-4 rounded-lg">
                    <div className="font-display text-xl font-bold text-navy">
                      {formulaResidentialLabel}
                    </div>
                    {formulaResidentialSub && (
                      <div className="text-sm text-navy/60">{formulaResidentialSub}</div>
                    )}
                  </div>
                )}

                {formulaHotelLabel && (
                  <>
                    <span className="text-2xl font-bold text-gold">+</span>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="font-display text-xl font-bold text-navy">
                        {formulaHotelLabel}
                      </div>
                      {formulaHotelSub && (
                        <div className="text-sm text-navy/60">{formulaHotelSub}</div>
                      )}
                    </div>
                  </>
                )}

                {formulaResultLabel && (
                  <>
                    <span className="text-2xl font-bold text-gold">=</span>
                    <div className="bg-gold p-4 rounded-lg">
                      <div className="font-display text-xl font-bold text-navy">
                        {formulaResultLabel}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
