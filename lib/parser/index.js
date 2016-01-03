'use babel';

import algebra from 'algebra.js'
import { pick } from 'lodash';

import CalcaParser from './CalcaParser';

export function parse(editor) {
  var parser = new CalcaParser();
  editor.scan(/s*.* ?=>? ?(.*)/ig, (scanner) => {
    let line = scanner.matchText;
    try {
      let answer = parser.parseRow(line);
      let thereforeIndex = line.indexOf("=>");
      if (answer && thereforeIndex >= 0 && scanner.match[1] !== answer) {
        let newLine = `${line.substring(0, thereforeIndex + 2)} ${answer}`;
        let cachedPosition = editor.getCursorBufferPosition();
        scanner.replace(newLine);
        editor.setCursorBufferPosition(cachedPosition);
      }
    } catch (e) {
      // no-op
      // TODO: Use linter?
    }
  });
}
