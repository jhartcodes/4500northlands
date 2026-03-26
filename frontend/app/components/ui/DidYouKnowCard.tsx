import CustomPortableText from '@/app/components/PortableText'
import Icon from '@/app/components/ui/Icons'

type DidYouKnowCardProps = {
  icon?: string
  eyebrow?: string
  title?: string
  body?: any[]
  isDark?: boolean
  className?: string
}

export default function DidYouKnowCard({
  icon,
  eyebrow = 'Did You Know?',
  title,
  body,
  isDark = false,
  className = '',
}: DidYouKnowCardProps) {
  const bgClass = isDark ? 'bg-white/10' : 'bg-cream'
  const textColor = isDark ? 'text-white' : 'text-navy'
  const iconColor = isDark ? 'text-gold' : 'text-gold'

  return (
    <div className={`${bgClass} p-6 md:p-8 rounded-lg ${className}`}>
      {icon && (
        <div className={`mb-3 ${iconColor}`}>
          <Icon name={icon} className="w-10 h-10 md:w-12 md:h-12" />
        </div>
      )}
      {eyebrow && (
        <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-2">{eyebrow}</p>
      )}
      {title && (
        <h4 className={`font-display text-xl md:text-2xl font-bold mb-4 ${textColor}`}>{title}</h4>
      )}
      {body && body.length > 0 && <CustomPortableText value={body} isDark={isDark} />}
    </div>
  )
}
