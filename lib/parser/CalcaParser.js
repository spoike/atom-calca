'use babel';

import { tokenizeRow as defaultTokenizerFn, lettersOnly } from './lexer';
import { take, takeRight, reduce, find } from 'lodash';
import algebra from 'algebra.js'

function takeRest(arr, startingIndex) {
  return takeRight(arr, arr.length - (1 + startingIndex));
}

function hasVariable(expression, variableToFind) {
  return !!find(expression.terms, (term) => {
    return !!find(term.variables, (variable) => {
      return variable.variable === variableToFind;
    });
  });
}

export default class CalcaParser {
  constructor(tokenizerFn) {
    this.tokenizerFn = tokenizerFn || defaultTokenizerFn;
    this.assignments = {};
    this.cachedTokens = [];
  }

  reevaluate(currentSymbol, currentExpression) {
    let toEvalWith = {};
    toEvalWith[currentSymbol] = currentExpression;
    this.assignments = reduce(this.assignments, (memo, assignment, symbol) => {
      if (hasVariable(assignment, currentSymbol)) {
        memo[symbol] = assignment.eval(toEvalWith);
      } else {
        memo[symbol] = assignment;
      }
      return memo;
    }, {});
  }

  convertExpression(rhsTokens, assignmentKey) {
    let tokens = rhsTokens
        .filter((token) => token !== "=>");
    var output;
    if (tokens.length === 1) {
      output = tokens[0];
    }
    else if (tokens.length > 1) {
      output = algebra.parse(tokens.join(""));
      this.reevaluate(assignmentKey, output);
    }
    if (output && output.eval) {
      let symbols = rhsTokens
          .filter(token => lettersOnly.test(token))
          .reduce((memo, symbol) => {
            let a = this.assignments[symbol];
            if (a) {
              a = isNaN(a) ? a : +a;
              memo[symbol] = a;
            }
            return memo;
          }.bind(this), {});
      output = output.eval(symbols);
    }
    return output;
  }

  parseAssignment(tokens) {
    var answer;
    if (tokens.length > 0) {
      let assignmentIndex = tokens.indexOf("=");
      if (assignmentIndex >= 1) {
        let lhs = tokens[0];
        let rhs = takeRest(tokens, assignmentIndex);
        answer = this.convertExpression(rhs, lhs);
        this.assignments[lhs] = answer;
      }
    }
    return answer;
  }

  parseRow(row) {
    var tokens = this.tokenizerFn(row);
    for (let i = this.cachedTokens.length - 1; i >= 0 && /^=>?$/.test(tokens[0]) ;--i) {
      tokens = this.cachedTokens[i].concat(tokens);
    }
    var answer = this.parseAssignment(tokens);
    if (tokens[tokens.length - 1] === "=>") {
      let rhsTokens = take(tokens, tokens.length - 1);
      let rhs = this.convertExpression(rhsTokens);
      answer = answer || this.assignments[rhs] || rhs;
    }
    this.cachedTokens.push(tokens);
    return answer ? answer.toString() : answer;
  }
}
