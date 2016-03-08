'use babel';

require('./patch');

import { tokenizeRow as defaultTokenizerFn } from './lexer';
import { take, takeRight, reduce, find } from 'lodash';
import algebra from 'algebra.js';
import { validIdentifier } from './regexp';

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
    this.decimals = 0;
  }

  reevaluate(currentSymbol, currentExpression) {
    let toEvalWith = {};
    toEvalWith[currentSymbol] = currentExpression;
    toEvalWith = Object.assign(toEvalWith, this.assignments);
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
      output = algebra.parse(tokens[0]);
    }
    else if (tokens.length > 1) {
      output = algebra.parse(tokens.join(""));
    }
    if (output && output.eval) {
      let symbols = rhsTokens
          .filter(token => validIdentifier.test(token))
          .reduce((memo, symbol) => {
            let a = this.assignments[symbol];
            if (a) {
              memo[symbol] = a;
            }
            return memo;
          }.bind(this), {});
      output = output.eval(symbols);
      this.reevaluate(assignmentKey, output);
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
        if (answer) {
          this.assignments[lhs] = answer;
        }
      }
    }
    return answer;
  }

  checkDecimal(tokens) {
    this.decimals = tokens.reduce((decimals, token) => {
      var matches = token.match(/\d+\.(\d+)$/);
      if (matches && matches[1]) {
        decimals = Math.max(matches[1].length, decimals);
      }
      return decimals;
    }, this.decimals);
  }

  answerToDecimals(input) {
    var answer;
    if (this.decimals === 0) {
      return input;
    }
    let matches = input.match(/^(\d+)\/?(\d+)?$/);
    if (matches && matches[2]) {
      answer = ((+matches[1])/(+matches[2])).toFixed(this.decimals);
    }
    return answer || (+input).toFixed(this.decimals);
  }

  parseRow(row) {
    var tokens = this.tokenizerFn(row);
    this.checkDecimal(tokens);
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
    return answer ? this.answerToDecimals(answer.toString()) : answer;
  }
}
