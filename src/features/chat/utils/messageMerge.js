import { normalizeMaybeRow } from './messageMappers'

export function mergeAfterChatSend(prev, tmpId, data, optimisticMessage) {
  const withoutTmp = prev.filter((message) => message.id !== tmpId)
  const userMessage = normalizeMaybeRow(data?.userMessage) ?? optimisticMessage
  const assistantMessage =
    normalizeMaybeRow(data?.assistantMessage) ?? normalizeMaybeRow(data)

  if (!userMessage && !assistantMessage) {
    return withoutTmp
  }

  const rest = withoutTmp.filter((message) => {
    if (userMessage && message.id === userMessage.id) return false
    if (assistantMessage && message.id === assistantMessage.id) return false
    return true
  })

  if (userMessage) rest.push(userMessage)
  if (assistantMessage) rest.push(assistantMessage)
  return rest
}

export function appendAssistantMessage(prev, row) {
  if (prev.some((message) => message.id === row.id)) return prev
  return [...prev, row]
}
