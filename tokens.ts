export enum TokenType {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  PLUS,
  MINUS,
  SLASH,
  ASTERISK,
  VOID,
  CHAR,
  INT,
  FLOAT,
  DOUBLE,
  IDENTIFIER,
  STRING_LITERAL,
  INT_LITERAL,
  FLOAT_LITERAL
}

export const charToToken: Record<string, TokenType> = {
  '(': TokenType.LEFT_PAREN,
  ')': TokenType.RIGHT_PAREN,
  '{': TokenType.LEFT_BRACE,
  '}': TokenType.RIGHT_BRACE,
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '/': TokenType.SLASH,
  '*': TokenType.ASTERISK,
}

export const stringToKeyword: Record<string, TokenType> = {
  'void': TokenType.VOID,
  'char': TokenType.CHAR,
  'int': TokenType.INT,
  'double': TokenType.DOUBLE,
  'float': TokenType.FLOAT,
}