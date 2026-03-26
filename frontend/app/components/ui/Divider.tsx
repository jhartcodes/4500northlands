type DividerProps = {
  className?: string
}

export default function Divider({className = ''}: DividerProps) {
  return <div className={`w-12 h-1 bg-gold ${className}`} />
}
