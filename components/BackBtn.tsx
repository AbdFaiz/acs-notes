import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const BackBtn = ({ href, label }: { href: string; label: string }) => {
  return (
    <div>
      <Link href={href}
        className="inline-flex items-center gap-1 text-sm mb-6 transition-colors text-(--text-3) hover:text-foreground">
        <ChevronLeft size={15} /> {label}
      </Link>
    </div>
  )
}

export default BackBtn
