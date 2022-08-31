

export function wrapByExtension(src: string, markdown: string): string {
  const urlProtocolIndex = src.lastIndexOf('://');
  const urlWithoutProtocol = urlProtocolIndex > -1
    ? src.substring(urlProtocolIndex + 4)
    : src;

  const lastSlashIndex = urlWithoutProtocol.lastIndexOf('/');
  const lastUrlSegment = lastSlashIndex > -1
    ? urlWithoutProtocol.substring(lastSlashIndex + 1).split('?')[0]
    : '';

  const lastDotIndex = lastUrlSegment.lastIndexOf('.');
  const extension = lastDotIndex > -1
    ? lastUrlSegment.substring(lastDotIndex + 1)
    : '';

  return !!extension && extension !== 'md'
    ? '```' + extension + '\n' + markdown + '\n```'
    : markdown;
}
