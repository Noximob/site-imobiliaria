'use client'

import { trackWhatsAppClick } from '@/lib/analytics'

type Props = {
  href: string
  page: string
  className?: string
  children: React.ReactNode
}

export default function WhatsAppLink({ href, page, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(page)}
      className={className}
    >
      {children}
    </a>
  )
}
