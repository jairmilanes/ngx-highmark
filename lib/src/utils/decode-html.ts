import {ParseOptions} from "../types";

export function htmlDecode(html: string, options: ParseOptions): string {
  if (!options.decodeHtml) return html;

  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}
