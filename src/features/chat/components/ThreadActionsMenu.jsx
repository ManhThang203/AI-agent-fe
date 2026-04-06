import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../../store/settingsStore'

function IconPencil({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4l9.5-9.5-4-4L4 16v4zM13.5 6.5l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTrash({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ThreadActionsMenu({
  threadMenu,
  onRename,
  onDelete,
}) {
  const { t } = useTranslation('chat')
  const isLight = useSettingsStore((state) => state.theme === 'light')

  if (!threadMenu) return null

  const menuSurface = isLight
    ? 'border border-zinc-200 bg-white shadow-xl'
    : 'border border-zinc-800 bg-zinc-900 shadow-xl'
  const menuItem = isLight
    ? 'text-zinc-800 hover:bg-zinc-100'
    : 'text-zinc-200 hover:bg-zinc-800'

  return createPortal(
    <div
      data-thread-menu-root
      role="menu"
      className={`fixed z-100 w-44 overflow-hidden rounded-xl py-1 ${menuSurface}`}
      style={{
        top: threadMenu.top,
        left: threadMenu.left,
      }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        role="menuitem"
        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${menuItem}`}
        onClick={() => onRename(threadMenu.thread)}
      >
        <IconPencil
          className={`h-4 w-4 shrink-0 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}
        />
        {t('renameThread')}
      </button>
      <button
        type="button"
        role="menuitem"
        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 ${isLight ? '' : 'hover:bg-zinc-800'}`}
        onClick={() => onDelete(threadMenu.thread)}
      >
        <IconTrash className="h-4 w-4 shrink-0 text-red-400/80" />
        {t('deleteThread')}
      </button>
    </div>,
    document.body,
  )
}
