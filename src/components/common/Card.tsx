import { createContext, forwardRef, useContext, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

const CardContext = createContext<{ size?: 'sm' | 'md' | 'lg' }>({})

type CardProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, size = 'md', ...rest }, ref) => (
    <CardContext.Provider value={{ size }}>
      <div
        ref={ref}
        className={cn(
          'rounded-3xl border border-border/70 bg-card/80 shadow-glow backdrop-blur-xl',
          size === 'sm' && 'rounded-2xl',
          size === 'lg' && 'rounded-[1.75rem]',
          className,
        )}
        {...rest}
      />
    </CardContext.Provider>
  ),
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...rest}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...rest }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-tight tracking-tight', className)}
      {...rest}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...rest }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...rest} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => {
    const { size } = useContext(CardContext)
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 pb-6',
          size === 'sm' && 'px-4 pb-4',
          size === 'lg' && 'px-8 pb-8',
          className,
        )}
        {...rest}
      />
    )
  },
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 p-6 pt-0', className)}
      {...rest}
    />
  ),
)
CardFooter.displayName = 'CardFooter'
