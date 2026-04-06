import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ChatMessageList from '../ChatMessageList'

describe('ChatMessageList', () => {
  it('renders loading, messages, and thinking state', () => {
    render(
      <ChatMessageList
        scrollRef={{ current: null }}
        loading={false}
        messages={[
          { id: '1', role: 'user', content: 'Hello' },
          { id: '2', role: 'assistant', content: 'Hi there' },
        ]}
        sending={false}
        thinking={{ text: 'thinking' }}
        showThinkingBubble
        onFeedbackChange={() => {}}
      />,
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('thinking')
  })
})
