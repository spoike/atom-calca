'use babel';

const CalcaParser = require('../lib/parser/CalcaParser');

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.

describe("CalcaParser", () => {

  let parser;

  beforeEach(() => {
    parser = new CalcaParser();
  });

  it("should ignore empty lines", () => {
    let answer = parser.parseRow("");
    expect(answer).toBeUndefined();
    //expect(() => parser.parse("")).toThrow(new ParserError());
  });

  it("should ignore whitespaced lines", () => {
    let answer = parser.parseRow("   ");
    expect(answer).toBeUndefined();
  });

  describe("therefore (=>)", () => {

    it("should provide answer for an unset symbol", () => {
      let answer = parser.parseRow("x =>");
      expect(answer).toBe("x");
    });

    it("should provide answer for a set symbol", () => {
      parser.parseRow("x = 3");
      let answer = parser.parseRow("x =>");
      expect(answer).toBe("3");
    });

    it("should provide answer for a set symbol in a one liner", () => {
      let answer = parser.parseRow("x = 3 =>");
      expect(answer).toBe("3");
    });

    it("should provide answer for a symbol set in a seperate line", () => {
      parser.parseRow("x");
      let answer = parser.parseRow("= 3 =>");
      expect(answer).toBe("3");
    });

  });

  describe("assignment (=)", () => {

    it("should provide expression from the assignment", () => {
      let answer = parser.parseRow("x = 1337");
      expect(answer).toBe("1337");
    });

  });

  describe("simple addition expression", () => {

    it("should provide answer to the expression", () => {
      let answer = parser.parseRow("1+2=>");
      expect(answer).toBe("3");
    });

  });

});
