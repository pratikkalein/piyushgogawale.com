'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export type Photo = {
  url: string
  thumbUrl: string
  alt: string
  width: number
  height: number
}

export const Gallery = ({ photos }: { photos: Photo[] }) => {
  const [index, setIndex] = useState(-1)

  if (photos.length === 0) {
    return <p className="text-steel">No photos in this gallery yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo, i) => (
          <button
            key={photo.url + i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open photo ${i + 1}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-surface"
          >
            <Image
              src={photo.thumbUrl}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={photos.map((p) => ({
          src: p.url,
          alt: p.alt,
          width: p.width,
          height: p.height,
          description: p.alt,
        }))}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.92)' } }}
      />
    </>
  )
}
