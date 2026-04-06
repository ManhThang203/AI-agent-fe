import ThreadListItem from './ThreadListItem'

export default function ThreadList({
  threads,
  activeThreadId,
  threadMenu,
  listScrollRef,
  fallbackTitle,
  threadActionsLabel,
  onSelect,
  onToggleMenu,
}) {
  return (
    <div
      ref={listScrollRef}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain p-2"
    >
      <ul className="flex flex-col gap-1">
        {threads.map((thread) => (
          <ThreadListItem
            key={thread.id}
            thread={thread}
            active={thread.id === activeThreadId}
            threadMenu={threadMenu}
            onSelect={onSelect}
            onToggleMenu={onToggleMenu}
            threadActionsLabel={threadActionsLabel}
            fallbackTitle={fallbackTitle}
          />
        ))}
      </ul>
    </div>
  )
}
