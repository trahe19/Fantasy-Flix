// Enhanced Currency Formatter for Box Office Display
// Handles large amounts with responsive text sizing and container optimization

export interface FormattedAmount {
  display: string
  fullAmount: string
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  containerClass: string
}

// Enhanced box office amount formatter with responsive sizing
export function formatBoxOfficeAmount(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`
  } else if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  } else {
    return `$${amount.toLocaleString()}`
  }
}

// Enhanced formatter that returns sizing information
export function formatBoxOfficeAmountWithSize(amount: number): FormattedAmount {
  const fullAmount = `$${amount.toLocaleString()}`

  if (amount >= 10000000000) { // $10B+
    return {
      display: `$${(amount / 1000000000).toFixed(1)}B`,
      fullAmount,
      size: 'lg',
      containerClass: 'min-w-[100px]'
    }
  } else if (amount >= 1000000000) { // $1B+
    return {
      display: `$${(amount / 1000000000).toFixed(1)}B`,
      fullAmount,
      size: 'xl',
      containerClass: 'min-w-[90px]'
    }
  } else if (amount >= 100000000) { // $100M+
    return {
      display: `$${(amount / 1000000).toFixed(0)}M`,
      fullAmount,
      size: 'xl',
      containerClass: 'min-w-[80px]'
    }
  } else if (amount >= 10000000) { // $10M+
    return {
      display: `$${(amount / 1000000).toFixed(1)}M`,
      fullAmount,
      size: '2xl',
      containerClass: 'min-w-[85px]'
    }
  } else if (amount >= 1000000) { // $1M+
    return {
      display: `$${(amount / 1000000).toFixed(1)}M`,
      fullAmount,
      size: '2xl',
      containerClass: 'min-w-[80px]'
    }
  } else if (amount >= 100000) { // $100K+
    return {
      display: `$${(amount / 1000).toFixed(0)}K`,
      fullAmount,
      size: '2xl',
      containerClass: 'min-w-[75px]'
    }
  } else if (amount >= 1000) { // $1K+
    return {
      display: `$${(amount / 1000).toFixed(0)}K`,
      fullAmount,
      size: '2xl',
      containerClass: 'min-w-[70px]'
    }
  } else {
    return {
      display: `$${amount.toLocaleString()}`,
      fullAmount,
      size: '2xl',
      containerClass: 'min-w-[60px]'
    }
  }
}

// Get responsive text size class
export function getTextSizeClass(size: FormattedAmount['size']): string {
  const sizeMap = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl'
  }
  return sizeMap[size]
}

// Special formatter for different contexts
export function formatForContext(amount: number, context: 'card' | 'modal' | 'chart' | 'table'): FormattedAmount {
  const base = formatBoxOfficeAmountWithSize(amount)

  switch (context) {
    case 'card':
      // Cards need compact display
      if (amount >= 1000000000) {
        return { ...base, size: 'lg', containerClass: 'min-w-[80px] max-w-[120px]' }
      }
      return { ...base, size: 'xl', containerClass: 'min-w-[70px] max-w-[100px]' }

    case 'modal':
      // Modals can have larger text
      return { ...base, size: '2xl', containerClass: 'min-w-[100px] max-w-[200px]' }

    case 'chart':
      // Charts need very compact display
      if (amount >= 1000000000) {
        return {
          display: `$${(amount / 1000000000).toFixed(0)}B`,
          fullAmount: base.fullAmount,
          size: 'sm',
          containerClass: 'min-w-[50px] max-w-[70px]'
        }
      } else if (amount >= 1000000) {
        return {
          display: `$${(amount / 1000000).toFixed(0)}M`,
          fullAmount: base.fullAmount,
          size: 'sm',
          containerClass: 'min-w-[45px] max-w-[65px]'
        }
      }
      return { ...base, size: 'xs', containerClass: 'min-w-[40px] max-w-[60px]' }

    case 'table':
      // Tables need consistent width
      return { ...base, size: 'base', containerClass: 'w-[85px] text-right' }

    default:
      return base
  }
}

// Budget formatter with proper scaling
export function formatBudget(budget: number): FormattedAmount {
  return formatForContext(budget, 'card')
}

// Revenue formatter with proper scaling
export function formatRevenue(revenue: number): FormattedAmount {
  return formatForContext(revenue, 'card')
}

// Projection formatter for estimated amounts
export function formatProjection(amount: number): FormattedAmount {
  const formatted = formatForContext(amount, 'modal')
  return {
    ...formatted,
    display: `~${formatted.display}`, // Add tilde to indicate estimate
  }
}

// Format amount with proper overflow handling
export function formatWithEllipsis(amount: number, maxWidth: number = 120): FormattedAmount {
  const base = formatBoxOfficeAmountWithSize(amount)

  // If the display would be too wide, use more aggressive abbreviation
  if (base.display.length > 8) {
    if (amount >= 1000000000) {
      return {
        display: `$${Math.round(amount / 1000000000)}B`,
        fullAmount: base.fullAmount,
        size: base.size,
        containerClass: `max-w-[${maxWidth}px] truncate`
      }
    } else if (amount >= 1000000) {
      return {
        display: `$${Math.round(amount / 1000000)}M`,
        fullAmount: base.fullAmount,
        size: base.size,
        containerClass: `max-w-[${maxWidth}px] truncate`
      }
    }
  }

  return {
    ...base,
    containerClass: `${base.containerClass} max-w-[${maxWidth}px] truncate`
  }
}