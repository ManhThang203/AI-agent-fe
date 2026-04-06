import { useCallback, useEffect, useRef, useState } from 'react'

export function useVoiceComposer({ setComposerText, unsupportedMessage }) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.()
      } catch {
        /* ignore */
      }
    }
  }, [])

  const startOrToggleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      window.alert(unsupportedMessage)
      return
    }

    if (listening) {
      try {
        recognitionRef.current?.stop?.()
      } catch {
        /* ignore */
      }
      setListening(false)
      recognitionRef.current = null
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = document.documentElement.lang?.startsWith('en')
      ? 'en-US'
      : 'vi-VN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript
      if (!transcript) return
      setComposerText((prev) => {
        const next = prev ? `${prev} ${transcript}` : transcript
        return next
      })
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }, [listening, setComposerText, unsupportedMessage])

  return {
    listening,
    startOrToggleVoiceInput,
  }
}
