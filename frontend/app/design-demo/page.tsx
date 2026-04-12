'use client'

import {useEffect, useRef, useState} from 'react'
import SectionWrapper from '@/app/components/ui/SectionWrapper'
import DesignPicker, {type VariationInfo} from '@/app/components/design-demo/DesignPicker'
import TimelineModule from '@/app/components/design-demo/TimelineModule'
import VisionDevelopmentModule from '@/app/components/design-demo/VisionDevelopmentModule'

type ReviewModule = 'timeline' | 'vision'

const moduleOrder: ReviewModule[] = ['timeline', 'vision']

const timelineVariations: VariationInfo[] = [
  {id: 1, name: 'Chevron Flow'},
  {id: 2, name: 'Stacked Cards'},
  {id: 3, name: 'Vertical Spine'},
]

const visionVariations: VariationInfo[] = [
  {id: 1, name: 'Layered Cards'},
  {id: 2, name: 'Grid Blocks'},
  {id: 3, name: 'Flowing Columns'},
]

const reviewModules = [
  {id: 'timeline' as const, label: 'Timeline', variations: timelineVariations},
  {id: 'vision' as const, label: 'Development Plan', variations: visionVariations},
]

export default function DesignDemoPage() {
  const [timelineVariation, setTimelineVariation] = useState<1 | 2 | 3>(1)
  const [visionVariation, setVisionVariation] = useState<1 | 2 | 3>(1)
  const [activeModule, setActiveModule] = useState<ReviewModule>('timeline')

  const timelineRef = useRef<HTMLDivElement>(null)
  const visionRef = useRef<HTMLDivElement>(null)

  const activeVariations = activeModule === 'timeline' ? timelineVariations : visionVariations
  const activeVariation = activeModule === 'timeline' ? timelineVariation : visionVariation

  function scrollToModule(module: ReviewModule) {
    const target = module === 'timeline' ? timelineRef.current : visionRef.current

    if (!target) return

    const top = target.getBoundingClientRect().top + window.scrollY - 112
    window.scrollTo({top, behavior: 'smooth'})
  }

  function setVariationForModule(module: ReviewModule, variation: 1 | 2 | 3) {
    if (module === 'timeline') {
      setTimelineVariation(variation)
      return
    }

    setVisionVariation(variation)
  }

  function handleModuleChange(module: ReviewModule) {
    setActiveModule(module)
    scrollToModule(module)
  }

  function handleVariationSelect(variation: 1 | 2 | 3) {
    setVariationForModule(activeModule, variation)
    scrollToModule(activeModule)
  }

  function moveReview(direction: 'previous' | 'next') {
    const moduleIndex = moduleOrder.indexOf(activeModule)
    const isPrevious = direction === 'previous'
    const nextVariation = isPrevious ? activeVariation - 1 : activeVariation + 1

    if (nextVariation >= 1 && nextVariation <= 3) {
      setVariationForModule(activeModule, nextVariation as 1 | 2 | 3)
      scrollToModule(activeModule)
      return
    }

    const boundaryModuleIndex = isPrevious ? moduleIndex - 1 : moduleIndex + 1
    const wrappedModuleIndex =
      boundaryModuleIndex < 0
        ? moduleOrder.length - 1
        : boundaryModuleIndex >= moduleOrder.length
          ? 0
          : boundaryModuleIndex

    const nextModule = moduleOrder[wrappedModuleIndex]
    const nextModuleVariation = isPrevious ? 3 : 1

    setActiveModule(nextModule)
    setVariationForModule(nextModule, nextModuleVariation)
    scrollToModule(nextModule)
  }

  useEffect(() => {
    const timelineNode = timelineRef.current
    const visionNode = visionRef.current

    if (!timelineNode || !visionNode) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visibleEntry) return

        if (visibleEntry.target === timelineNode) {
          setActiveModule('timeline')
          return
        }

        setActiveModule('vision')
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-20% 0px -35% 0px',
      },
    )

    observer.observe(timelineNode)
    observer.observe(visionNode)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <SectionWrapper background="navy" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url('/images/tile-grid-white.png')",
            backgroundSize: '220px',
            backgroundPosition: 'center',
          }}
        />

        <div className="container relative">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">
              Design Review
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Review the new module directions.
            </h1>
            <p className="mt-5 max-w-[60ch] text-base leading-7 text-white/80 sm:text-lg">
              Click through the floating toolbar using next and previous to review the designs.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <div className="pb-32 sm:pb-36">
        <div ref={timelineRef} id="timeline-review" className="scroll-mt-28">
          <TimelineModule variation={timelineVariation} />
        </div>

        <div ref={visionRef} id="vision-review" className="scroll-mt-28">
          <VisionDevelopmentModule variation={visionVariation} />
        </div>
      </div>

      <DesignPicker
        modules={reviewModules}
        activeModule={activeModule}
        currentVariation={activeVariation}
        onModuleChange={handleModuleChange}
        onSelectVariation={handleVariationSelect}
        onPrevious={() => moveReview('previous')}
        onNext={() => moveReview('next')}
        activeVariationName={activeVariations.find((variation) => variation.id === activeVariation)?.name ?? ''}
      />
    </>
  )
}
