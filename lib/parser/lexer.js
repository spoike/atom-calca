'use babel';

import { indexOf } from "lodash";
import XRegExp from "xregexp";

const splitRegex = /([\+\-*\/^\(\)]|=>?|\s)/;
const lettersOnly = new XRegExp("^\\p{L}+$", "i");

export function tokenizeRow(row) {
  if (!row) { return []; }

  let tokens = XRegExp.split(row, splitRegex)
      .reduce((memo, token, idx) => {
        // ignore whitespace and empty token
        if (/^\s*$/.test(token)) {
          return memo;
        }

        let previous = memo[memo.length-1];
        // handle long names
        if (!!previous && lettersOnly.test(token) && lettersOnly.test(previous)) {
          memo[memo.length-1] = `${previous} ${token}`;
          return memo;
        }

        memo.push(token);
        return memo;
      }, []);

  // Remove all tokens after therefore
  // (since there will be a generated answer after it)
  const thereforeIndex = indexOf(tokens, "=>");
  if (thereforeIndex >= 0) {
    tokens = tokens.splice(0, thereforeIndex + 1);
  }

  return tokens;
}
