'use babel';

const lexer = require('../lib/parser/lexer');
const tokenizeRow = lexer.tokenizeRow;

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.

describe("lexer#tokenizeRow", () => {

  it("should return no tokens with empty line", () => {
    expect(tokenizeRow("").length).toEqual(0);
  });

  it("should return no tokens when the line only has whitespace", () => {
    expect(tokenizeRow("   ").length).toEqual(0);
  });

  describe("with simple assignment (x = 3)", () => {
    let tokens = tokenizeRow("x = 3");

    it("should tokenize with appropriate values", () => {
      expect(tokens[0].toString()).toEqual("x");
      expect(tokens[1].toString()).toEqual("=");
      expect(tokens[2].toString()).toEqual("3");
    });

  });

  describe("with simple therefore (x => answer)", () => {
    let tokens = tokenizeRow("x => answer");

    it("should tokenize with appropriate values", () => {
      expect(tokens[0].toString()).toEqual("x");
      expect(tokens[1].toString()).toEqual("=>");
    });

    it("should not tokenize lhs of therefore operator", () => {
      expect(tokens[2]).toBeUndefined();
    });
  });

  it("should tokenize therefore if it is not seperated by spaces", () => {
    let tokens = tokenizeRow("x=>answer");
    expect(tokens[0].toString()).toEqual("x");
    expect(tokens[1].toString()).toEqual("=>");
    expect(tokens[2]).toBeUndefined();
  });

  describe("with combined assignment and therefore (x = 3 => answer)", () => {
    let tokens = tokenizeRow("x = 3 => answer");

    it("should tokenize with appropriate values", () => {
      expect(tokens[0].toString()).toEqual("x");
      expect(tokens[1].toString()).toEqual("=");
      expect(tokens[2].toString()).toEqual("3");
      expect(tokens[3].toString()).toEqual("=>");
    });

    it("should not tokenize lhs of therefore operator", () => {
      expect(tokens[4]).toBeUndefined();
    });
  });

  describe("with operators (+ - * /)", () => {
    const operators = "+-*/^";

    it("should tokenize the operators", () => {
      for (let i = 0; i < operators.length; i++) {
        let currentOperator = operators[i];
        let tokens = tokenizeRow(`1${currentOperator}2`);
        expect(tokens[0].toString()).toEqual("1");
        expect(tokens[1].toString()).toEqual(currentOperator);
        expect(tokens[2].toString()).toEqual("2");
      }
    });
  });

  it("should be able to handle parens", () => {
    let tokens = tokenizeRow("(5 + x)");

    expect(tokens[0].toString()).toEqual("(");
    expect(tokens[4].toString()).toEqual(")");
  });

  it("should be able to handle negative numbers", () => {
    let tokens = tokenizeRow("-1 + -2.0 - -3");

    expect(tokens[0].toString()).toEqual("-");
    expect(tokens[3].toString()).toEqual("-");
    expect(tokens[6].toString()).toEqual("-");
  });

  it("should be able to tokenize unicode letters", () => {
    let tokens = tokenizeRow("x+áçñ+している");

    expect(tokens[0].toString()).toEqual("x");
    expect(tokens[2].toString()).toEqual("áçñ");
    expect(tokens[4].toString()).toEqual("している");
  });

  it("should handle long names (with spaces in between)", () => {
    let tokens = tokenizeRow("x + xtra long");

    expect(tokens[2].toString()).toEqual("xtra long");
  });

  it("should be handle long names (with spaces in between) with unicode letters", () => {
    let tokens = tokenizeRow("x + xtrá loñg");

    expect(tokens[2].toString()).toEqual("xtrá loñg");
  });

});
