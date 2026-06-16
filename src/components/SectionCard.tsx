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
  <Link href={`/sections/${slug}`} className="group flex flex-col">
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="img-zoom object-cover"
        />
      )}
    </div>
    <div className="mt-5 flex items-start justify-between gap-4">
      <h3 className="font-display text-[26px] leading-tight text-ink">{title}</h3>
      <span
        aria-hidden="true"
        className="mt-2 block h-px w-6 shrink-0 bg-ink transition-all duration-300 ease-out group-hover:w-12"
      />
    </div>
    {intro && <p className="mt-2 line-clamp-2 max-w-[42ch] text-sm text-steel">{intro}</p>}
  </Link>
)
