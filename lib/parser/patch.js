const Lexer = require("algebra.js/src/lexer");

// Patches algrabra.js's lexer to handle Calca's
// "long name" identifiers
Lexer.prototype._process_identifier = function() {
  var endpos = this.pos + 1;
  while (endpos < this.buflen &&
         Lexer._isalphanum(this.buf.charAt(endpos))) {
    if (this.buf.charAt(endpos + 1) === ' ' &&
        Lexer._isalphanum(this.buf.charAt(endpos + 2))) {
      endpos++;
    }
    endpos++;
  }

  var tok = {
    type: 'IDENTIFIER',
    value: this.buf.substring(this.pos, endpos),
    pos: this.pos
  };
  this.pos = endpos;
  return tok;
};
