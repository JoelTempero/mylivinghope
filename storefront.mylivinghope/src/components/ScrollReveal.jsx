import useScrollReveal from '../hooks/useScrollReveal'

const variantClass = {
  'fade-up': 'reveal-fade-up',
  'fade-in': 'reveal-fade-in',
  'slide-left': 'reveal-slide-left',
  'slide-right': 'reveal-slide-right',
  'scale-up': 'reveal-scale-up',
  'blur-in': 'reveal-blur-in',
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  ...props
}) {
  const { ref, isVisible } = useScrollReveal()
  const baseClass = variantClass[variant] || variantClass['fade-up']

  return (
    <Tag
      ref={ref}
      className={`${baseClass} ${isVisible ? 'in-view' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}
