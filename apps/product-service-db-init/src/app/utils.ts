/**
 * Transform a given string to a new string that starts with an upper-case letter.
 */
export function firstLetterToUpperCase(text: string): string {
  if (text.length < 2) {
    return text;
  }

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

/**
 * Transform a given string to a new string that replaces every series of space characters with a whitespace.
 */
export function replaceSpacesWithSingleWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ');
}
