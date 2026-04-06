import { useSettingsStore } from '../../../store/settingsStore'

function IconMore({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
    </svg>
  )
}

export default function ThreadListItem({
  thread,
  active,
  threadMenu,
  onSelect,
  onToggleMenu,
  threadActionsLabel,
  fallbackTitle,
}) {
  const isLight = useSettingsStore((state) => state.theme === 'light')

  const rowActive = isLight
    ? 'bg-zinc-200 text-zinc-900'
    : 'bg-zinc-900 text-zinc-50'
  const rowIdle = isLight
    ? 'text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900'
    : 'text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-200'

  return (
    <li>
      <div
        className={[
          'flex min-h-[44px] items-stretch gap-0.5 rounded-lg transition',
          active ? rowActive : rowIdle,
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() => onSelect(thread.id)}
          className="min-w-0 flex-1 px-2 py-2.5 text-left text-sm md:pl-3"
        >
          <span className="line-clamp-2">{thread.title?.trim() || fallbackTitle}</span>
        </button>
        <div className="flex shrink-0 items-center pr-1">
          <button
            type="button"
            data-thread-more-btn
            className={[
              'rounded-md p-1.5 transition',
              active
                ? isLight
                  ? 'text-zinc-600 hover:bg-zinc-300/80 hover:text-zinc-900'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                : isLight
                  ? 'text-zinc-500 hover:bg-zinc-200/90 hover:text-zinc-800'
                  : 'text-zinc-500 hover:bg-zinc-900/90 hover:text-zinc-200',
              threadMenu?.thread?.id === thread.id
                ? isLight
                  ? 'bg-zinc-300/80 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-100'
                : '',
            ].join(' ')}
            aria-label={threadActionsLabel}
            aria-expanded={threadMenu?.thread?.id === thread.id}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              onToggleMenu(thread, event.currentTarget)
            }}
          >
            <IconMore className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  )
}
