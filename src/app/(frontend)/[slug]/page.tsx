import { notFound } from 'next/navigation'
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return (
    <article className="mx-auto max-w-[760px] px-6 py-20 lg:py-28">
      <h1 className="hero-display text-ink">{page.title}</h1>
      <div className="prose-editorial mt-10">
        {page.content && (
          <RichText data={page.content as unknown as SerializedEditorState} />
        )}
      </div>
    </article>
  )
}
