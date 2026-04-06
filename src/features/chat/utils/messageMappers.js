export function normalizeRow(row) {
  return {
    id: String(row.id),
    role: row.role,
    content: row.content,
    createdAt: row.createdAt,
    feedback: row.feedback ?? null,
  }
}

export function normalizeMaybeRow(row) {
  if (!row || typeof row !== 'object') return null
  if (typeof row.content !== 'string' || typeof row.role !== 'string') {
    return null
  }
  return normalizeRow(row)
}
