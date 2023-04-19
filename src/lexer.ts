import Token from "./token";
import { charToToken, stringToKeyword, TokenType } from "./tokens";

export default class Lexer {
  source: string;
  line: number;
  bol: number;
  cursor: number;
  peeker: number;
  tokens: Token[];
  eof: boolean;
  length: number;
  error?: string;
  constructor(source: string) {
    this.source = source;
    this.line = 0;
    this.bol = 0;
    this.cursor = 0;
    this.peeker = 0;
    this.tokens = [];
    this.eof = false;
    this.length = source.length;
    this.error = undefined;
  }

  isWhiteSpace(char: string) {
    return char.trim().length === 0;
  }

  increment(amount: number = 1) {
    this.cursor += amount;
    this.peeker = this.cursor;
  }

  peek() {
    if (this.peeker >= this.length) {
      this.eof = true;
      return;
    }
    return this.source[++this.peeker];
  }

  current() {
    if (this.cursor >= this.length) {
      this.eof = true;
      return;
    }
    return this.source[this.cursor];
  }

  stringLiteral() {
    const quote = this.current();
    while (this.peek() !== quote) {}
    const literal = this.source.slice(this.cursor + 1, this.peeker);
    this.peeker++;
    this.cursor = this.peeker;
    return literal;
  }

  numberLiteral() {
    let decimal = this.current() === ".";
    while (this.isNumeric(this.peek())) {}
    if (decimal) {
      const literal = this.source.slice(this.cursor, this.peeker);
      this.peeker++;
      this.cursor = this.peeker;
      return { token: TokenType.FLOAT_LITERAL, literal: parseFloat(literal) };
    }
    if (this.source[this.peeker] !== ".") {
      const literal = this.source.slice(this.cursor, this.peeker);
      this.peeker++;
      this.cursor = this.peeker;
      return { token: TokenType.INT_LITERAL, literal: parseInt(literal, 10) };
    }
    while (this.isNumeric(this.peek())) {}
    const literal = this.source.slice(this.cursor, this.peeker);
    this.peeker++;
    this.cursor = this.peeker;
    return { token: TokenType.FLOAT_LITERAL, literal: parseFloat(literal) };
  }

  isNumeric(char?: string) {
    const charCode = char ? char.charCodeAt(0) : this.current()?.charCodeAt(0);
    return charCode && charCode >= 48 && charCode <= 57;
  }

  isAlphaNumeric(char?: string) {
    const charCode = char ? char.charCodeAt(0) : this.current()?.charCodeAt(0);
    return charCode && ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122));
  }

  token() {
    if (this.cursor >= this.length) {
      this.eof = true;
      return;
    }
    const char = this.current();
    if (!char) return;
    if (this.isWhiteSpace(char)) {
      this.increment();
      if (char === "\n") {
        this.line++;
        this.bol = this.cursor;
      }
      return;
    }
    const charToken = charToToken[char];
    if (charToken) {
      this.tokens.push(new Token(charToken));
      this.increment();
      return;
    }
    if (char === "'" || char === '"') {
      const literal = this.stringLiteral();
      this.tokens.push(new Token(TokenType.STRING_LITERAL, literal));
      this.increment();
      return;
    }
    if (this.isAlphaNumeric()) {
      let literal = "";
      while (this.isAlphaNumeric(this.peek())) {
        literal += this.current();
        this.increment();
      }
      if (stringToKeyword[literal]) {
        this.tokens.push(new Token(stringToKeyword[literal]));
        return;
      }
      this.tokens.push(new Token(TokenType.IDENTIFIER, literal));
      return;
    }
    if (this.isNumeric() || char === ".") {
      const { token, literal } = this.numberLiteral();
      this.tokens.push(new Token(token, literal));
      return;
    }
    this.error = this.errorString(char);
  }

  errorString(char: string) {
    return `Unexpected character ${char} at line ${this.line} column ${
      this.cursor - this.bol
    }`;
  }

  lex() {
    while (!this.eof && !this.error) {
      debugger;
      this.token();
    }
    return this.tokens;
  }
}
