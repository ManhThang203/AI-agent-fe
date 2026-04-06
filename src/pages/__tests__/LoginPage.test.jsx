import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { useAuthStore } from '../../store/authStore'

vi.mock('../../api/authApi', () => ({
  loginRequest: vi
    .fn()
    .mockResolvedValue({ access_token: 'at', refresh_token: 'rt' }),
  meRequest: vi.fn().mockResolvedValue({
    id: '1',
    email: 'a@b.com',
    username: 'u1',
  }),
}))

import { loginRequest, meRequest } from '../../api/authApi'

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({
    access_token: null,
    refresh_token: null,
    user: null,
  })
  vi.clearAllMocks()
})

describe('LoginPage', () => {
  it('submits credentials and calls login + me', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<div>ok-chat</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'secret12')
    await user.click(screen.getByRole('button', { name: /submitLogin/i }))

    await waitFor(() => {
      expect(loginRequest).toHaveBeenCalledWith('a@b.com', 'secret12')
    })
    await waitFor(() => {
      expect(meRequest).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(screen.getByText('ok-chat')).toBeInTheDocument()
    })
  })
})
