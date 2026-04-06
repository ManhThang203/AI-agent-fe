import { useEffect } from 'react'
import { useSettingsStore } from '../../store/settingsStore'

export default function ThemeSync() {
  const theme = useSettingsStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return null
}
