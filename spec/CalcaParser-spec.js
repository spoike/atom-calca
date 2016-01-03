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

    it("should provide answer to expression from previous line", () => {
      parser.parseRow("1+2");
      let answer = parser.parseRow("=>");
      expect(answer).toBe("3");
    });

    it("should provide answer to the expression and assignment from previous line", () => {
      parser.parseRow("x=1+2");
      let answer = parser.parseRow("x =>");
      expect(answer).toBe("3");
    });

  });

  describe("using assigned variable in simple expression", () => {

    it("should provide answer", () => {
      parser.parseRow("y=1+2");
      let answer = parser.parseRow("x=y+3=>");
      expect(answer).toBe("6");
    });

    it("should provide answer in reverse order", () => {
      parser.parseRow("x=y+3");
      parser.parseRow("y=1+2");
      let answer = parser.parseRow("x=>");
      expect(answer).toBe("6");
    });

    it("should handle answer for 3 expressions", () => {
      parser.parseRow("x=y+3");
      parser.parseRow("y=1+z");
      parser.parseRow("z = 2");
      let answer = parser.parseRow("x=>");
      expect(answer).toBe("6");
    });

  });

  describe("using incomplete expressions", () => {

    it("should ignore incomplete assignments", () => {
      parser.parseRow("a =");
      parser.parseRow("x = a*2");
      // shouldn't crash with TypeError
      let answer = parser.parseRow("x =>");
      expect(answer).toBe("2a"); // or 2 * a
    });

  });

});
