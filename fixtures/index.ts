import pluralize from "pluralize";

export {pluralize};

export function plural(word: string): string {
  return pluralize(word);
}
