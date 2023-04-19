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

  identifier() {
    while (this.isAlphaNumeric(this.peek())) {}
    const literal = this.source.slice(this.cursor, this.peeker);
    this.cursor = this.peeker;
    const keyword = stringToKeyword[literal];
    if (keyword) {
      this.tokens.push(new Token(keyword));
      return;
    }
    this.tokens.push(new Token(TokenType.IDENTIFIER, literal));
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

  preprocessor() {
    while (this.peek() !== "\n") {}
    const directive = this.source.slice(this.cursor, this.peeker);
    const [command, ...args] = directive.split(" ");
    if (command === "#include") {
      this.tokens.push(new Token(TokenType.PPD_INCLUDE, args[0]));
    }
    else if (command === "#define") {
      if(args.length !== 2) {
        this.error = `Invalid number of arguments for #define at line ${this.line}` 
        return;
      }
      this.tokens.push(new Token(TokenType.PPD_DEFINE, args[0], args[1]));
    }
    else {
      this.error = `Invalid preprocessor directive at line ${this.line}`;
      return;
    }
    this.peeker++;
    this.cursor = this.peeker;
  }

  isNumeric(char?: string) {
    const charCode = char ? char.charCodeAt(0) : this.current()?.charCodeAt(0);
    return charCode && charCode >= 48 && charCode <= 57;
  }

  isAlphaNumeric(char?: string) {
    const charCode = char ? char.charCodeAt(0) : this.current()?.charCodeAt(0);
    return (
      charCode &&
      ((charCode >= 48 && charCode <= 57) ||
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122))
    );
  }

  isAlpha(char?: string) {
    const charCode = char ? char.charCodeAt(0) : this.current()?.charCodeAt(0);
    return (
      charCode &&
      ((charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122))
    );
  }
  token() {
    if (this.cursor >= this.length) {
      this.eof = true;
      return;
    }
    const char = this.current();
    if (!char) return;
    if (char === "#") {
      this.preprocessor();
      return;
    }
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
    if (this.isAlpha()) {
      this.identifier();
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
