import { describe, expect, it } from 'vitest'
import {
  appendAssistantMessage,
  mergeAfterChatSend,
} from '../messageMerge'

describe('messageMerge', () => {
  it('merges optimistic user message with full chat payload', () => {
    const optimistic = { id: 'local-1', role: 'user', content: 'Hello' }
    const result = mergeAfterChatSend(
      [optimistic],
      'local-1',
      {
        userMessage: { id: '1', role: 'user', content: 'Hello' },
        assistantMessage: { id: '2', role: 'assistant', content: 'Hi there' },
      },
      optimistic,
    )

    expect(result).toEqual([
      { id: '1', role: 'user', content: 'Hello', createdAt: undefined, feedback: null },
      { id: '2', role: 'assistant', content: 'Hi there', createdAt: undefined, feedback: null },
    ])
  })

  it('keeps optimistic user message when payload only returns assistant', () => {
    const optimistic = { id: 'local-1', role: 'user', content: 'Hello' }
    const result = mergeAfterChatSend(
      [optimistic],
      'local-1',
      { id: '2', role: 'assistant', content: 'Hi there' },
      optimistic,
    )

    expect(result).toEqual([
      optimistic,
      { id: '2', role: 'assistant', content: 'Hi there', createdAt: undefined, feedback: null },
    ])
  })

  it('does not append duplicate assistant messages', () => {
    const existing = [{ id: '2', role: 'assistant', content: 'Hi there' }]
    const result = appendAssistantMessage(existing, existing[0])

    expect(result).toBe(existing)
  })
})
