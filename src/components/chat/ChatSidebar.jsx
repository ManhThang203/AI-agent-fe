import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconMenu } from '../grok/GrokIcons'
import { deleteThreadMessagesRequest } from '../../api/agentMessagesApi'
import { computeThreadMenuPosition } from '../../features/chat/utils/threadMenuPosition'
import ThreadActionsMenu from '../../features/chat/components/ThreadActionsMenu'
import ThreadList from '../../features/chat/components/ThreadList'
import { useScrollClose } from '../../shared/hooks/useScrollClose'
import { useSettingsStore } from '../../store/settingsStore'
import { useChatThreadsStore } from '../../store/chatThreadsStore'
import ChatUserMenu from './ChatUserMenu'

function IconPlus({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SidebarNewChatButton({ onClick, label, className }) {
  return (
    <button type="button" onClick={onClick} className={className}>
      <IconPlus className="h-4 w-4" />
      {label}
    </button>
  )
}

export default function ChatSidebar({ mobileOpen, onCloseMobile }) {
  const { t } = useTranslation('chat')
  const isLight = useSettingsStore((state) => state.theme === 'light')
  const threads = useChatThreadsStore((state) => state.threads)
  const activeThreadId = useChatThreadsStore((state) => state.activeThreadId)
  const setActiveThread = useChatThreadsStore((state) => state.setActiveThread)
  const newThread = useChatThreadsStore((state) => state.newThread)
  const renameThread = useChatThreadsStore((state) => state.renameThread)
  const removeThread = useChatThreadsStore((state) => state.removeThread)
  const [threadMenu, setThreadMenu] = useState(null)
  const listScrollRef = useRef(null)

  const shell = isLight
    ? 'border-r border-zinc-200 bg-zinc-50'
    : 'border-r border-zinc-800/90 bg-zinc-950'
  const headerBar = isLight
    ? 'border-zinc-200 text-zinc-900'
    : 'border-zinc-800/90 text-zinc-200'
  const newChatBtn = isLight
    ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300'
    : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800'
  const footerBar = isLight ? 'border-zinc-200' : 'border-zinc-800/90'

  useScrollClose(listScrollRef, () => setThreadMenu(null), Boolean(threadMenu))
  useEffect(() => {
    if (!threadMenu) return undefined

    const onDocMouseDown = (event) => {
      if (event.target.closest?.('[data-thread-menu-root]')) return
      if (event.target.closest?.('[data-thread-more-btn]')) return
      setThreadMenu(null)
    }

    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [threadMenu])

  const selectThread = useCallback(
    (id) => {
      setActiveThread(id)
      onCloseMobile?.()
    },
    [onCloseMobile, setActiveThread],
  )

  const createThread = () => {
    newThread()
    onCloseMobile?.()
  }

  const sortedThreads = [...threads].sort((a, b) => b.updatedAt - a.updatedAt)

  const toggleThreadMenu = useCallback(
    (thread, anchorElement) => {
      if (threadMenu?.thread?.id === thread.id) {
        setThreadMenu(null)
        return
      }

      const position = computeThreadMenuPosition(
        anchorElement.getBoundingClientRect(),
      )
      setThreadMenu({ thread, ...position })
    },
    [threadMenu],
  )

  const onDeleteThread = async (thread) => {
    setThreadMenu(null)
    try {
      await deleteThreadMessagesRequest(thread.id)
      removeThread(thread.id)
    } catch (error) {
      const message =
        error?.response?.data?.message ?? error?.message ?? t('deleteThreadError')
      window.alert(message)
    }
  }

  const onRenameThread = (thread) => {
    const currentTitle = thread.title?.trim() || ''
    const nextTitle = window.prompt(t('renamePrompt'), currentTitle)
    if (nextTitle === null) return
    renameThread(thread.id, nextTitle)
    setThreadMenu(null)
  }

  const newChatClassName = [
    'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition',
    newChatBtn,
  ].join(' ')

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          aria-label={t('closeSidebar')}
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 z-40 flex h-dvh min-h-0 w-[min(88vw,280px)] flex-col overflow-hidden transition-transform duration-200 md:static md:z-0 md:h-full md:min-h-0 md:w-60 md:shrink-0 md:self-stretch md:translate-x-0 md:transition-none',
          shell,
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <div className={`shrink-0 ${headerBar}`}>
          <div
            className={`flex items-center gap-2 border-b p-2 md:hidden ${isLight ? 'border-zinc-200' : 'border-zinc-800/90'}`}
          >
            <button
              type="button"
              onClick={onCloseMobile}
              className={
                isLight
                  ? 'rounded-lg p-2 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                  : 'rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }
              aria-label={t('closeSidebar')}
            >
              <IconMenu className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium">{t('sidebarTitle')}</span>
          </div>

          <div
            className={`border-b p-2 ${isLight ? 'border-zinc-200' : 'border-zinc-800/90'}`}
          >
            <SidebarNewChatButton
              onClick={createThread}
              label={t('newChat')}
              className={newChatClassName}
            />
          </div>
        </div>

        <ThreadList
          threads={sortedThreads}
          activeThreadId={activeThreadId}
          threadMenu={threadMenu}
          listScrollRef={listScrollRef}
          fallbackTitle={t('newChat')}
          threadActionsLabel={t('threadActions')}
          onSelect={selectThread}
          onToggleMenu={toggleThreadMenu}
        />

        <div className={`mt-auto shrink-0 border-t p-3 ${footerBar}`}>
          <ChatUserMenu variant="sidebar" />
        </div>
      </aside>

      <ThreadActionsMenu
        threadMenu={threadMenu}
        onRename={onRenameThread}
        onDelete={onDeleteThread}
      />
    </>
  )
}
