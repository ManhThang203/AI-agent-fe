export function mapApiFieldErrors(fieldErrors, allowedFields, setError) {
  if (!fieldErrors || typeof fieldErrors !== 'object') return

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!allowedFields.includes(field)) continue
    const first = Array.isArray(messages) ? messages[0] : messages
    if (first) {
      setError(field, { message: String(first) })
    }
  }
}

export function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage
}
