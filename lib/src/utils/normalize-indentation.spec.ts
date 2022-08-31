import { trimLineStart } from './normalize-indentation';


describe('Utils: Normalize Indentation', () => {
  it('should remove leading whitespaces offset while keeping indent', () => {
    const mockRaw =  [
      ' ',              // first line with only whitespaces should not determine indent offset
      '  * list',         // find first line with non-whitespaces to set offset
      '     * sub-list',  // keep indent while removing from previous row offset
      '  ',               // keep blank line
      ' Negative indent', // keep line with negative offset according to first non-whitespaces line indent
      '  Lorem Ipsum',    // keep indent like equals to first non-whitespaces line ident
    ].join('\n');

    const mockRaw2 =  [
      '       ',          // first line with only whitespaces should not determine indent offset
      '  * list',         // find first line with non-whitespaces to set offset
      '     * sub-list',  // keep indent while removing from previous row offset
      '  ',               // keep blank line
      ' Negative indent', // keep line with negative offset according to first non-whitespaces line indent
      '  Lorem Ipsum',    // keep indent like equals to first non-whitespaces line ident
    ].join('\n');

    const expected = [
      '',
      '* list',
      '   * sub-list',
      '',
      'Negative indent',
      'Lorem Ipsum',
    ].join('\n');

    expect(trimLineStart(mockRaw)).toBe(expected);

    expect(trimLineStart(mockRaw2)).toBe(expected);
  });
});
