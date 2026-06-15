import React from 'react'

/**
 * sunset-stripe-band — the brand's signature closing band, rendered at the
 * foot of every page just above the footer. Never drop it.
 */
export const SunsetBand = () => (
  <div
    aria-hidden="true"
    className="w-full py-5"
    style={{
      background:
        'linear-gradient(90deg, var(--color-primary) 0%, var(--color-sunshine-700) 30%, var(--color-sunshine-500) 55%, var(--color-yellow-saturated) 78%, var(--color-cream) 100%)',
    }}
  />
)
