'use babel';

const parser = require('../lib/parser');
const parseRow = parser.parseRow;

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.

describe("reduceLine", () => {

  it("should return same state as input when empty line is given", () => {
    expect(parseRow("1337", "")).toBe("1337");
  });

  describe("when simple assignment is given (x = 3)", () => {
    var state;

    beforeEach(() => {
      state = parseRow(null, "x = 3");
    });

    it("should have the same row output", () => {
      expect(state.currentRow).toBe("x = 3");
    });

    describe("when seeking x", () => {

      beforeEach(() => {
        state = parseRow(state, "x =>");
      });
      /*
      it("should output the row with an answer in it", () => {
        expect(state.currentRow).toBe("x => 3");
      });
      */
    });
  });

});
