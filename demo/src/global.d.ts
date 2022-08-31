export {};

interface joypixels {
  shortnameToUnicode(input: string): string;
}

declare global {
  interface Window {
    joypixels: joypixels
  }
}
