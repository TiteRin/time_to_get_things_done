/** Invalid user input; the message is user-facing and can be shown next to the field */
export class ValidationError extends Error {
  override name = 'ValidationError'
}
