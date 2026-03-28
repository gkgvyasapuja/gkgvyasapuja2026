export default function notNullNotUndefinedNotEmpty<T>(
  value: T | null | undefined | "",
) {
  return value !== null && value !== undefined && value !== "";
}
