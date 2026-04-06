const prefix =
  import.meta.env.VITE_AGENT_SOCKET_CHANNEL_PREFIX || 'agent-user'

export function getAgentChannelName(userId) {
  const id = String(userId)
  const base = `${prefix}-${id}`
  const usePrivate =
    String(import.meta.env.VITE_AGENT_PUSHER_USE_PRIVATE_CHANNELS || '')
      .toLowerCase() === 'true'
  return usePrivate ? `private-${base}` : base
}

export function isPrivateChannel() {
  return (
    String(import.meta.env.VITE_AGENT_PUSHER_USE_PRIVATE_CHANNELS || '')
      .toLowerCase() === 'true'
  )
}
