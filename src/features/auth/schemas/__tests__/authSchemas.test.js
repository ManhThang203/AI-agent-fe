import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from '../authSchemas'

const t = (key) => key

describe('authSchemas', () => {
  it('validates login payload', () => {
    const result = loginSchema(t).safeParse({
      email: 'user@example.com',
      password: 'secret',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid register payload', () => {
    const result = registerSchema(t).safeParse({
      email: 'bad-email',
      username: 'u',
      password: '123',
    })

    expect(result.success).toBe(false)
  })
})
