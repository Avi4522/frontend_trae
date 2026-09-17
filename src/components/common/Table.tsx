import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...rest }, ref) => (
    <div className="relative w-full overflow-auto rounded-2xl">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...rest}
      />
    </div>
  ),
)
Table.displayName = 'Table'

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...rest }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...rest}
  />
))
TableCaption.displayName = 'TableCaption'

export const Thead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...rest }, ref) => (
    <thead
      ref={ref}
      className={cn('border-b border-border/70 bg-muted/30 backdrop-blur', className)}
      {...rest}
    />
  ),
)
Thead.displayName = 'Thead'

export const Tbody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...rest }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...rest} />
  ),
)
Tbody.displayName = 'Tbody'

export const Tr = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...rest }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border/50 transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted/50',
        className,
      )}
      {...rest}
    />
  ),
)
Tr.displayName = 'Tr'

export const Th = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...rest }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        className,
      )}
      {...rest}
    />
  ),
)
Th.displayName = 'Th'

export const Td = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...rest }, ref) => (
    <td
      ref={ref}
      className={cn('px-4 py-3 align-middle text-sm text-foreground', className)}
      {...rest}
    />
  ),
)
Td.displayName = 'Td'

export const TableHeaderCell = Th
export const TableCell = Td

export function TableEmptyRow({
  colSpan,
  children,
}: {
  colSpan: number
  children?: ReactNode
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-10 text-center text-sm text-muted-foreground"
      >
        {children ?? 'No data found.'}
      </td>
    </tr>
  )
}
