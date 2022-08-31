

export function trimLineStart(markdown: string): string {
  if (!markdown) {
    return '';
  }

  let lastIndentCount: number;

  return markdown
    .split('\n')
    .map(line => {
      let lineIdentCount = lastIndentCount;

      if (line.length > 0) {
        const indentCount = line.search(/\S|$/);

        lineIdentCount = isNaN(lineIdentCount)
          ? indentCount
          : Math.min(indentCount, lineIdentCount);
      }

      // Skip line if all it has is white spaces
      if (isNaN(lastIndentCount) && lineIdentCount < line.length) {
        lastIndentCount = lineIdentCount;
      }

      return line.substring(lineIdentCount || 0);
    }).join('\n');
}
