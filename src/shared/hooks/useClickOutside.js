import { useEffect } from 'react'

export function useClickOutside(refs, onOutsideClick, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const refList = Array.isArray(refs) ? refs : [refs]
    const onDocMouseDown = (event) => {
      const target = event.target
      const clickedInside = refList.some((ref) => {
        const node = ref?.current
        return node && node.contains(target)
      })

      if (!clickedInside) {
        onOutsideClick?.(event)
      }
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [enabled, onOutsideClick, refs])
}
