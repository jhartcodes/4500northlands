'use client'

export type VariationInfo = {
  id: 1 | 2 | 3
  name: string
}

type ReviewModule = 'timeline' | 'vision'

type ModuleInfo = {
  id: ReviewModule
  label: string
  variations: VariationInfo[]
}

type DesignPickerProps = {
  modules: ModuleInfo[]
  activeModule: ReviewModule
  currentVariation: 1 | 2 | 3
  activeVariationName: string
  onModuleChange: (module: ReviewModule) => void
  onSelectVariation: (variation: 1 | 2 | 3) => void
  onPrevious: () => void
  onNext: () => void
}

export default function DesignPicker({
  modules,
  activeModule,
  currentVariation,
  activeVariationName,
  onModuleChange,
  onSelectVariation,
  onPrevious,
  onNext,
}: DesignPickerProps) {
  const activeModuleLabel = modules.find((module) => module.id === activeModule)?.label ?? ''
  const activeVariations = modules.find((module) => module.id === activeModule)?.variations ?? []

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6">
      <div className="pointer-events-auto mx-auto max-w-5xl">
        <div className="clip-corner border border-navy/12 bg-white/92 shadow-[0_20px_48px_-30px_rgba(27,58,82,0.4)] backdrop-blur-md">
          <div className="flex flex-col gap-4 p-3 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {modules.map((module) => {
                  const isActive = module.id === activeModule

                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => onModuleChange(module.id)}
                      className={[
                        'clip-corner inline-flex min-h-11 items-center whitespace-nowrap border px-4 py-2 text-sm font-semibold transition duration-200',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy/35',
                        isActive
                          ? 'border-gold bg-gold text-navy'
                          : 'border-navy/12 bg-white text-navy/72 hover:border-navy/24 hover:text-navy',
                      ].join(' ')}
                    >
                      {module.label}
                    </button>
                  )
                })}
              </div>

              <div className="px-1 text-sm text-navy/68">
                <span className="font-semibold text-navy">{activeModuleLabel}</span>
                {' · '}
                <span>{activeVariationName}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="clip-corner inline-flex min-h-11 items-center gap-2 border border-navy/12 bg-white px-4 py-2 text-sm font-semibold text-navy transition duration-200 hover:border-navy/24 hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy/35"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                  </svg>
                  Previous
                </button>

                <button
                  type="button"
                  onClick={onNext}
                  className="clip-corner inline-flex min-h-11 items-center gap-2 border border-navy/12 bg-white px-4 py-2 text-sm font-semibold text-navy transition duration-200 hover:border-navy/24 hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy/35"
                >
                  Next
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {activeVariations.map((variation) => {
                  const isActive = variation.id === currentVariation

                  return (
                    <button
                      key={variation.id}
                      type="button"
                      onClick={() => onSelectVariation(variation.id)}
                      className={[
                        'clip-corner inline-flex min-h-11 items-center gap-3 whitespace-nowrap border px-4 py-2 text-sm font-semibold transition duration-200',
                        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy/35',
                        isActive
                          ? 'border-gold bg-navy text-white'
                          : 'border-navy/12 bg-white text-navy/72 hover:border-navy/24 hover:text-navy',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'inline-flex h-7 w-7 items-center justify-center text-xs font-bold',
                          isActive ? 'bg-gold text-navy' : 'bg-navy/8 text-navy',
                        ].join(' ')}
                      >
                        {variation.id}
                      </span>
                      {variation.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
