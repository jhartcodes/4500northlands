import 'server-only'

/**
 * Keep the preview token optional so production can run without Draft Mode access.
 * Preview environments can opt in by setting SANITY_API_READ_TOKEN.
 */
export const token = process.env.SANITY_API_READ_TOKEN || false
