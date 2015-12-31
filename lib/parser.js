'use babel';

import algebra from 'algebra.js'
import { pick } from 'lodash';

function filterLhs(assignments, left) {
  let filtered = pick(assignments, (val, key) => key !== left);
  return filtered;
}

export function reduceLine(state, line) {
  state = state || { lines: [], expressions: [] };
  if (!state.lines) { state.lines = []; }
  if (!state.assignments) { state.assignments = {}; }
  state.hasResult = false;
  state.result = null;
  if (!line) { return state; }
  state.lines.push(line);
  let [, left, operator, right] = line.match(/(.*) ?(=>?) ?(.*)/i);
  left = left.trim();
  right = right.trim();
  switch(operator) {
    case "=>":
      try {
        if (!isNaN(left)) {
          state.result = left.trim();
        } else if (state.assignments[left]) {
          state.result = state.assignments[left]
              .eval(filterLhs(state.assignments, left))
              .toString();
        } else {
          state.result = algebra.parse(left).eval(state.assignments).toString();
        }
        state.hasResult = !!state.result;
      } catch (e) {
        // no-op
      }
      break;
    case "=":
      let parsed = algebra.parse(right);
      if (parsed) {
        state.assignments[left] = parsed.eval(state.assignments).simplify();
      }
      break;
    default:
      break;
  }
  return state;
}

export function parse(editor) {
  var parserState = {};
  editor.scan(/s*.* ?=>? ?(.*)/ig, (scanner) => {
    parserState = reduceLine(parserState, scanner.matchText);
    if (parserState.hasResult &&
        scanner.match[1] !== parserState.result) {
      let line = scanner.matchText;
      let resultOffset = line.indexOf("=>") + 2;
      let newLine = `${line.substring(0, resultOffset)} ${parserState.result}`;
      let cachedPosition = editor.getCursorBufferPosition();
      scanner.replace(newLine);
      editor.setCursorBufferPosition(cachedPosition);
    }
  });
}
