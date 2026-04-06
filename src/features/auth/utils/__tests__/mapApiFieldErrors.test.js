import { describe, expect, it, vi } from 'vitest'
import {
  getApiErrorMessage,
  mapApiFieldErrors,
} from '../mapApiFieldErrors'

describe('mapApiFieldErrors', () => {
  it('maps only allowed fields', () => {
    const setError = vi.fn()

    mapApiFieldErrors(
      {
        email: ['Email invalid'],
        password: ['Password invalid'],
        ignored: ['Ignore me'],
      },
      ['email', 'password'],
      setError,
    )

    expect(setError).toHaveBeenCalledTimes(2)
    expect(setError).toHaveBeenCalledWith('email', { message: 'Email invalid' })
    expect(setError).toHaveBeenCalledWith('password', {
      message: 'Password invalid',
    })
  })

  it('returns fallback message when error payload is missing', () => {
    expect(getApiErrorMessage({}, 'fallback')).toBe('fallback')
  })
})
