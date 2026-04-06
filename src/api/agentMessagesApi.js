import { api, unwrap } from './client'

export function listMessagesRequest(limit = 20, threadId) {
  return api
    .get('/api/agentMessages/messages', { params: { limit, threadId } })
    .then((r) => unwrap(r))
}

export function chatRequest({ input, threadId }) {
  return api
    .post('/api/agentMessages/chat', { input, threadId })
    .then((r) => unwrap(r))
}

export function deleteThreadMessagesRequest(threadId) {
  return api
    .delete(`/api/agentMessages/thread/${encodeURIComponent(threadId)}`)
    .then((r) => unwrap(r))
}

export function patchMessageFeedbackRequest(messageId, feedback) {
  return api
    .patch(
      `/api/agentMessages/messages/${encodeURIComponent(messageId)}/feedback`,
      { feedback },
    )
    .then((r) => unwrap(r))
}
