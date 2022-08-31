import {ParseOptions} from "../types";

export const errorJoyPixelsNotLoaded = '[ngx-highmark] When using the `emoji` attribute you *have to* include Emoji-Toolkit files to `angular.json` or use imports. See README for more information';

export function parseEmojis(markdown: string, options: ParseOptions): string {
  if (!options.emoji) return markdown;

  if (window['joypixels'] && typeof window['joypixels'].shortnameToUnicode === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return window['joypixels'].shortnameToUnicode(markdown);
  }

  throw new Error(errorJoyPixelsNotLoaded);
}
