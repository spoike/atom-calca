'use babel';

import { tokenizeRow as defaultTokenizerFn } from './lexer';
import { take, takeRight } from 'lodash';
import algebra from 'algebra.js'

function takeRest(arr, startingIndex) {
  return takeRight(arr, arr.length - (1 + startingIndex));
}

function convertExpression(rhsTokens) {
  let tokens = rhsTokens.filter((token) => token !== "=>");
  var output;
  if (tokens.length === 1) {
    output = tokens[0];
  }
  else if (tokens.length > 1) {
    output = algebra.parse(tokens.join("")).toString();
  }
  return output;
}

export default class CalcaParser {
  constructor(tokenizerFn) {
    this.tokenizerFn = tokenizerFn || defaultTokenizerFn;
    this.assignments = {};
    this.cachedTokens = [];
  }

  parseAssignment(tokens) {
    var answer;
    if (tokens.length > 0) {
      let assignmentIndex = tokens.indexOf("=");
      if (assignmentIndex >= 1) {
        let lhs = tokens[0];
        let rhs = takeRest(tokens, assignmentIndex);
        answer = convertExpression(rhs);
        this.assignments[lhs] = answer;
      }
    }
    return answer;
  }

  parseRow(row) {
    var tokens = this.tokenizerFn(row);
    for (let i = this.cachedTokens.length - 1; i > 0 || /^=>?$/.test(tokens[0]) ;--i) {
      tokens = this.cachedTokens[i].concat(tokens);
    }
    var answer = this.parseAssignment(tokens);
    if (tokens[tokens.length - 1] === "=>") {
      let rhs = answer || convertExpression(take(tokens, tokens.length - 1));
      answer = this.assignments[rhs] || rhs;
    }
    this.cachedTokens.push(tokens);
    return answer;
  }
}
