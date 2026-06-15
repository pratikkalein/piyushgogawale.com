import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export type SectionCardProps = {
  slug: string
  title: string
  intro?: string | null
  coverUrl: string | null
  alt: string
}

export const SectionCard = ({ slug, title, intro, coverUrl, alt }: SectionCardProps) => (
  <Link
    href={`/sections/${slug}`}
    className="group flex flex-col overflow-hidden rounded-lg border border-hairline-soft bg-canvas transition-shadow hover:shadow-[var(--shadow-card)]"
  >
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}
    </div>
    <div className="p-6">
      <h3 className="text-[28px] leading-tight text-ink">{title}</h3>
      {intro && <p className="mt-2 line-clamp-2 text-sm text-steel">{intro}</p>}
    </div>
  </Link>
)
