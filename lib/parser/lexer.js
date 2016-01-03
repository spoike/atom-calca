'use babel';

import { indexOf } from "lodash";
import XRegExp from "xregexp";
import { splitRegex, lettersOnly } from "./regexp";

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
        // handle number with incomplete decimal, e.g. (1.);
        if (/^\d*\.$/.test(token)) {
          token = token.substring(0, token.length - 1);
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
