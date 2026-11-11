import { useEffect, RefObject } from 'react'

/**
 * Presentation-only motion for route content.
 *
 * - Plays a soft rise/blur-in on the page container whenever `routeKey` changes
 *   (no remounting, so component state is untouched).
 * - Staggers the entrance of the first cards that are already on screen.
 * - Reveals cards further down the page as they scroll into view.
 *
 * It only touches `element.animate()` and a `data-io-reveal` attribute; React
 * never manages either, so it cannot interfere with rendering or data.
 */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const CARD_SELECTOR = '.rounded-card, table, [data-io-card]'

export function useRouteMotion(ref: RefObject<HTMLElement | null>, routeKey: string) {
  useEffect(() => {
    const root = ref.current
    if (!root || typeof window === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof root.animate !== 'function') return

    root.animate(
      [
        { opacity: 0, translate: '0 10px', filter: 'blur(6px)' },
        { opacity: 1, translate: '0 0', filter: 'blur(0px)' },
      ],
      { duration: 460, easing: EASE, fill: 'backwards' }
    )

    let observer: IntersectionObserver | null = null
    const frame = requestAnimationFrame(() => {
      const viewportH = window.innerHeight
      const cards = Array.from(root.querySelectorAll<HTMLElement>(CARD_SELECTOR)).filter(
        // only top-level cards: skip ones nested inside another card
        (el) => !el.parentElement?.closest(CARD_SELECTOR)
      )

      let staggerIndex = 0
      const below: HTMLElement[] = []
      for (const el of cards) {
        const rect = el.getBoundingClientRect()
        if (rect.top < viewportH && rect.bottom > 0) {
          if (staggerIndex < 18) {
            el.animate(
              [
                { opacity: 0, translate: '0 14px', scale: '0.985' },
                { opacity: 1, translate: '0 0', scale: '1' },
              ],
              { duration: 560, delay: 60 + staggerIndex * 45, easing: EASE, fill: 'backwards' }
            )
            staggerIndex++
          }
        } else if (rect.top >= viewportH && below.length < 80) {
          below.push(el)
        }
      }

      if (below.length && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const el = entry.target as HTMLElement
                el.setAttribute('data-io-reveal', 'in')
                observer?.unobserve(el)
              }
            })
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
        )
        below.forEach((el) => {
          el.setAttribute('data-io-reveal', 'hidden')
          observer!.observe(el)
        })
      }
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      root.querySelectorAll('[data-io-reveal="hidden"]').forEach((el) => el.setAttribute('data-io-reveal', 'in'))
    }
  }, [ref, routeKey])
}
