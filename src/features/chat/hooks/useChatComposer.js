import { useCallback, useRef, useState } from 'react'

export function useChatComposer() {
  const [input, setInput] = useState('')
  const composerRef = useRef(null)

  const getComposerText = useCallback(
    () => (composerRef.current?.textContent || '').replace(/\u00a0/g, ' ').trim(),
    [],
  )

  const setComposerText = useCallback((text) => {
    if (composerRef.current) composerRef.current.textContent = text
    setInput(text)
  }, [])

  const onComposerInput = useCallback(() => {
    setInput(composerRef.current?.textContent || '')
  }, [])

  const onComposerPaste = useCallback((event) => {
    event.preventDefault()
    const plain = event.clipboardData.getData('text/plain')
    if (typeof document === 'undefined' || !composerRef.current) return

    try {
      document.execCommand('insertText', false, plain)
    } catch {
      const composer = composerRef.current
      composer.textContent = (composer.textContent || '') + plain
    }

    setInput(composerRef.current?.textContent || '')
  }, [])

  return {
    input,
    setInput,
    composerRef,
    getComposerText,
    setComposerText,
    onComposerInput,
    onComposerPaste,
  }
}
