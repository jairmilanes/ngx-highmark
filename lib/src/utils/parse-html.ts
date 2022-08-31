import {marked} from "marked";
import {ParseOptions} from "../types";

export function parseMarked(html: string, options: ParseOptions): string {
  if (options.inline) {
    return marked.parseInline(html, options.markedOptions);
  }

  return marked.parse(html, options.markedOptions);
}
