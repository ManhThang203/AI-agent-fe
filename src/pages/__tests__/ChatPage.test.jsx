import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ChatPage from '../ChatPage'
import { useAuthStore } from '../../store/authStore'
import { useChatThreadsStore } from '../../store/chatThreadsStore'

vi.mock('../../hooks/usePusherAgent', () => ({
  usePusherAgent: () => {},
}))

const agentMessagesTest = vi.hoisted(() => {
  const listHi = {
    id: '1',
    role: 'user',
    content: 'hi',
    createdAt: new Date().toISOString(),
  }
  const listUserQ = {
    id: '10',
    role: 'user',
    content: 'Q?',
    createdAt: new Date().toISOString(),
  }
  const listAssistant = {
    id: '2',
    role: 'assistant',
    content: '**hello**',
    createdAt: new Date().toISOString(),
  }
  const listThreadTwoUser = {
    id: '20',
    role: 'user',
    content: 'Thread 2 question',
    createdAt: new Date().toISOString(),
  }
  const listThreadTwoAssistant = {
    id: '21',
    role: 'assistant',
    content: 'Thread 2 answer',
    createdAt: new Date().toISOString(),
  }
  const listMessagesRequest = vi.fn(async () => {
    const n = listMessagesRequest.mock.calls.length
    if (n === 1) return [listHi]
    return [listHi, listUserQ, listAssistant]
  })
  const chatRequest = vi.fn().mockResolvedValue({
    userMessage: listUserQ,
    assistantMessage: listAssistant,
  })
  return {
    listHi,
    listUserQ,
    listAssistant,
    listThreadTwoUser,
    listThreadTwoAssistant,
    listMessagesRequest,
    chatRequest,
  }
})

vi.mock('../../api/agentMessagesApi', () => ({
  listMessagesRequest: agentMessagesTest.listMessagesRequest,
  chatRequest: agentMessagesTest.chatRequest,
  deleteThreadMessagesRequest: vi.fn(),
  patchMessageFeedbackRequest: vi.fn(),
}))

import {
  listMessagesRequest,
  chatRequest,
} from '../../api/agentMessagesApi'

const {
  listHi,
  listUserQ,
  listAssistant,
  listThreadTwoUser,
  listThreadTwoAssistant,
} = agentMessagesTest

beforeEach(() => {
  useChatThreadsStore.getState().reset()
  useAuthStore.setState({
    user: { id: '99', email: 'x@x.com', username: 'me' },
  })
  vi.clearAllMocks()
  listMessagesRequest.mockImplementation(async () => {
    const n = listMessagesRequest.mock.calls.length
    if (n === 1) return [listHi]
    return [listHi, listUserQ, listAssistant]
  })
  chatRequest.mockResolvedValue({
    userMessage: listUserQ,
    assistantMessage: listAssistant,
  })
})

describe('ChatPage', () => {
  it('loads messages and sends chat', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalled()
    })
    const listCall = listMessagesRequest.mock.calls[0]
    expect(listCall[0]).toBe(50)
    expect(typeof listCall[1]).toBe('string')
    expect(listCall[1].length).toBeGreaterThan(0)

    await waitFor(() => {
      expect(screen.getAllByText('hi').length).toBeGreaterThanOrEqual(1)
    })

    await user.type(screen.getByRole('textbox', { name: 'placeholder' }), 'Q?')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(chatRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          input: 'Q?',
          threadId: listCall[1],
        }),
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Q?')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/hello/i)
    })
  })

  it('keeps user and assistant when stale list GET resolves empty after send', async () => {
    const user = userEvent.setup()
    let releaseFirst
    const firstGate = new Promise((r) => {
      releaseFirst = r
    })

    listMessagesRequest.mockImplementation(() => {
      const callIndex = listMessagesRequest.mock.calls.length
      if (callIndex === 1) {
        return firstGate.then(() => [])
      }
      return Promise.resolve([listHi, listUserQ, listAssistant])
    })

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalledTimes(1)
    })

    await user.type(screen.getByRole('textbox', { name: 'placeholder' }), 'Q?')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(chatRequest).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(
        screen.getAllByText('Q?').filter((el) => el.tagName === 'P').length,
      ).toBe(1)
    })
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/hello/i)
    })
    expect(listMessagesRequest.mock.calls.length).toBeGreaterThanOrEqual(2)

    releaseFirst()
    await new Promise((r) => setTimeout(r, 0))

    expect(
      screen.getAllByText('Q?').filter((el) => el.tagName === 'P').length,
    ).toBe(1)
    expect(document.body.textContent).toMatch(/hello/i)
  })

  it('shows preparingReply status while chat request is in flight', async () => {
    const user = userEvent.setup()
    let resolveChat
    const chatDeferred = new Promise((r) => {
      resolveChat = r
    })
    chatRequest.mockImplementation(() => chatDeferred)

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(screen.getAllByText('hi').length).toBeGreaterThanOrEqual(1)
    })

    await user.type(screen.getByRole('textbox', { name: 'placeholder' }), 'Q?')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(screen.getByRole('status')).toHaveTextContent('preparingReply')

    resolveChat({
      userMessage: listUserQ,
      assistantMessage: listAssistant,
    })
    await waitFor(() => {
      expect(screen.getByText('Q?')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('keeps the user message when chat response only returns assistant payload', async () => {
    const user = userEvent.setup()
    chatRequest.mockResolvedValue(listAssistant)
    listMessagesRequest.mockImplementation(async () => {
      const n = listMessagesRequest.mock.calls.length
      if (n === 1) return [listHi]
      throw new Error('history reload failed')
    })

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalledTimes(1)
    })
    await waitFor(() => {
      expect(screen.getAllByText('hi').length).toBeGreaterThanOrEqual(1)
    })

    await user.type(screen.getByRole('textbox', { name: 'placeholder' }), 'Q?')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(chatRequest).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(
        screen.getAllByText('Q?').filter((el) => el.tagName === 'P').length,
      ).toBe(1)
    })
    expect(document.body.textContent).toMatch(/hello/i)
  })

  it('loads the selected thread history from the sidebar', async () => {
    const user = userEvent.setup()
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
    listMessagesRequest.mockImplementation(async (_limit, threadId) => {
      if (threadId === 'thread-1') return [listHi]
      if (threadId === 'thread-2') {
        return [listThreadTwoUser, listThreadTwoAssistant]
      }
      return []
    })

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalledWith(50, 'thread-1')
    })
    await waitFor(() => {
      expect(screen.getAllByText('hi').length).toBeGreaterThanOrEqual(1)
    })

    await user.click(screen.getByRole('button', { name: 'Thread 2' }))

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalledWith(50, 'thread-2')
    })
    await waitFor(() => {
      expect(screen.getByText('Thread 2 question')).toBeInTheDocument()
    })
    expect(document.body.textContent).toMatch(/Thread 2 answer/i)
  })

  it('keeps stored thread messages when reloading a selected thread fails', async () => {
    const user = userEvent.setup()
    useChatThreadsStore.setState({
      threads: [
        {
          id: 'thread-1',
          title: 'Thread 1',
          messages: [listHi],
          updatedAt: 2,
        },
        {
          id: 'thread-2',
          title: 'Thread 2',
          messages: [listThreadTwoUser, listThreadTwoAssistant],
          updatedAt: 1,
        },
      ],
      activeThreadId: 'thread-1',
    })
    listMessagesRequest.mockImplementation(async (_limit, threadId) => {
      if (threadId === 'thread-1') return [listHi]
      if (threadId === 'thread-2') throw new Error('history failed')
      return []
    })

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalledWith(50, 'thread-1')
    })

    await user.click(screen.getByRole('button', { name: 'Thread 2' }))

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalledWith(50, 'thread-2')
    })
    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Thread 2 question')).toBeInTheDocument()
    expect(document.body.textContent).toMatch(/Thread 2 answer/i)
  })

  it('keeps header and composer outside the message scroll viewport', async () => {
    const { container } = render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(listMessagesRequest).toHaveBeenCalled()
    })

    const header = screen.getByText('appName').closest('header')
    const composer = screen.getByRole('form', { name: 'composerLabel' })
    const scrollViewport = container.querySelector(
      'div.overflow-y-auto.overscroll-contain',
    )

    expect(header).toBeTruthy()
    expect(header.className).toContain('sticky')
    expect(composer.className).toContain('sticky')
    expect(composer.className).toContain('bottom-0')
    expect(scrollViewport).toBeTruthy()
    expect(scrollViewport.className).toContain('flex-1')
    expect(scrollViewport.contains(header)).toBe(false)
    expect(scrollViewport.contains(composer)).toBe(false)
  })
})
