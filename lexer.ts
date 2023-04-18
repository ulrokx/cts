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
  constructor(source: string) {
    this.source = source;
    this.line = 0;
    this.bol = 0;
    this.cursor = 0;
    this.peeker = 0;
    this.tokens = [];
    this.eof = false;
    this.length = source.length;
  }

  isWhiteSpace(char: string) {
    return char.trim().length === 0;
  }

  increment(amount: number = 1) {
    this.cursor += amount;
    this.peeker = this.cursor;
  }

  peek() {
    return this.source[++this.peeker];
  }

  current() {
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
      return { token: TokenType.FLOAT_LITERAL, literal: parseFloat(literal) };
    }
    if (this.source[this.peeker] !== ".") {
      const literal = this.source.slice(this.cursor, this.peeker);
      return { token: TokenType.INT_LITERAL, literal: parseInt(literal, 10) };
    }
    while (this.isNumeric(this.peek())) {}
    const literal = this.source.slice(this.cursor, this.peeker);
    return { token: TokenType.FLOAT_LITERAL, literal: parseFloat(literal) };
  }

  isNumeric(char?: string) {
    const charCode = char ? char.charCodeAt(0) : this.current().charCodeAt(0);
    return charCode >= 48 && charCode <= 57;
  }

  token() {
    const char = this.current();
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
      const keyword = stringToKeyword[literal];
      if(keyword) {
        this.tokens.push(new Token(keyword));
      }
      else {this.tokens.push(new Token(TokenType.STRING_LITERAL, literal));
      }
      this.increment();
      return;
    }
    if (this.isNumeric() || char === ".") {
      const {token, literal} = this.numberLiteral();
      this.tokens.push(new Token(token, literal));
      this.increment;
      return;
    }

  }
}
