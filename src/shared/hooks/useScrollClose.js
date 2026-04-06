import { useEffect } from 'react'

export function useScrollClose(targetRef, onScroll, enabled = true) {
  useEffect(() => {
    if (!enabled || !targetRef?.current) return undefined

    const target = targetRef.current
    const handleScroll = () => onScroll?.()

    target.addEventListener('scroll', handleScroll, { passive: true })
    return () => target.removeEventListener('scroll', handleScroll)
  }, [enabled, onScroll, targetRef])
}
