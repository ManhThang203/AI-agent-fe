import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ChatSidebar from '../ChatSidebar'
import { useAuthStore } from '../../../store/authStore'
import { useChatThreadsStore } from '../../../store/chatThreadsStore'

describe('ChatSidebar layout', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '99', email: 'x@x.com', username: 'me' },
    })
    useChatThreadsStore.setState({
      threads: [
        {
          id: 'thread-1',
          title: 'Thread 1',
          messages: [],
          updatedAt: 2,
        },
        {
          id: 'thread-2',
          title: 'Thread 2',
          messages: [],
          updatedAt: 1,
        },
      ],
      activeThreadId: 'thread-1',
    })
  })

  it('keeps the thread list as the only scrollable sidebar section', () => {
    const { container } = render(
      <MemoryRouter>
        <ChatSidebar mobileOpen={false} />
      </MemoryRouter>,
    )

    const aside = container.querySelector('aside')
    const threadListViewport = container.querySelector(
      'div.overflow-y-auto.overscroll-contain',
    )

    expect(aside).toBeTruthy()
    expect(aside.className).toContain('overflow-hidden')
    expect(threadListViewport).toBeTruthy()
    expect(threadListViewport.className).toContain('flex-1')
    expect(screen.getByRole('button', { name: 'newChat' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Thread 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'userMenu.open' })).toBeInTheDocument()
  })
})
