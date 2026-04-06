import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThreadList from '../ThreadList'

describe('ThreadList', () => {
  it('renders active thread and triggers selection', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <ThreadList
        threads={[
          { id: '1', title: 'Thread 1' },
          { id: '2', title: 'Thread 2' },
        ]}
        activeThreadId="1"
        threadMenu={null}
        listScrollRef={{ current: null }}
        fallbackTitle="newChat"
        threadActionsLabel="threadActions"
        onSelect={onSelect}
        onToggleMenu={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Thread 2' }))

    expect(onSelect).toHaveBeenCalledWith('2')
  })
})
