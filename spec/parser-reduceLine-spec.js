'use babel';

parser = require('../lib/parser');

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.

describe("reduceLine", () => {

  it("should return same state as input when empty line is given", () => {
    expect(parser.reduceLine("1337", "")).toBe("1337");
  });

  it("should retrieve the result for a simple valid algebra expression", () => {
    let parserState = parser.reduceLine(null, "  x = 3");
    parserState = parser.reduceLine(parserState, "x => ");

    expect(parserState.hasResult).toBe(true);
    expect(parserState.result).toBe("3");
  });

  it("should ignore unfinished lines", () => {
    let parserState = parser.reduceLine(null, "unfinished business = ");
    expect(parserState.assignments).toEqual({});
  });

  it("should simplify expressions", () => {
    let parserState = parser.reduceLine(null, "x = 1 + 3");
    parserState = parser.reduceLine(parserState, "x => ");

    expect(parserState.result).toBe("4");
  });

  it("therefore should pass through constants", () => {
    let parserState = parser.reduceLine(null, "1 => ");

    expect(parserState.result).toBe("1");
  });

  it("should go through all previous expressions to find solution", () => {
    let parserState = parser.reduceLine(null, "x = 1");
    parserState = parser.reduceLine(parserState, "y = 2 + x");
    parserState = parser.reduceLine(parserState, "y =>");

    expect(parserState.result).toBe("3");
  });

  it("should be able to handle expression in lhs", () => {
    let parserState = parser.reduceLine(null, "x = 1");
    parserState = parser.reduceLine(parserState, "x + 1 =>");

    expect(parserState.result).toBe("2");
  });

  it("should be able to handle expression in lhs with multiple variables", () => {
    let parserState = parser.reduceLine(null, "x = 1");
    parserState = parser.reduceLine(parserState, "y = 2 + x");
    parserState = parser.reduceLine(parserState, "y + 1 =>");

    expect(parserState.result).toBe("4");
  });

  it("should be able to handle many expressions", () => {
    let parserState = parser.reduceLine(null, "x = 1");
    parserState = parser.reduceLine(parserState, "z = 2 + x");
    parserState = parser.reduceLine(parserState, "y = 2 + x");
    parserState = parser.reduceLine(parserState, "y + 1 =>");

    expect(parserState.result).toBe("4");
  });

  it("unfinished therefore expression should be ignored", () => {
    let parserState = parser.reduceLine(null, "* abba =>");
    
    expect(parserState.hasResult).toBe(false);
  });

});
