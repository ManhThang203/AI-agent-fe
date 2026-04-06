/**
 * @typedef {object} ChatMessage
 * @property {string} id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {string | undefined} [createdAt]
 * @property {'up' | 'down' | null | undefined} [feedback]
 */

/**
 * @typedef {object} ChatThread
 * @property {string} id
 * @property {string} title
 * @property {ChatMessage[]} messages
 * @property {number} updatedAt
 */

/**
 * @typedef {object} ThinkingState
 * @property {string | null | undefined} [id]
 * @property {number | null | undefined} [step]
 * @property {string | null | undefined} [action]
 * @property {string | null | undefined} [text]
 */

export {}
