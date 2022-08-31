import {DomSanitizer} from "@angular/platform-browser";
import {ParseOptions} from "../types";

export function sanitizer(sanitizer: DomSanitizer) {
  return (markdown: string, options: ParseOptions): string =>
    sanitizer.sanitize(
      options.securityContext,
      markdown,
    ) || '';
}
