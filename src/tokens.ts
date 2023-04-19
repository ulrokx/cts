export enum TokenType {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  PLUS,
  MINUS,
  SLASH,
  ASTERISK,
  HASH,
  LESS_THAN,
  GREATER_THAN,
  VOID,
  CHAR,
  INT,
  FLOAT,
  DOUBLE,
  INCLUDE,
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
  '#' : TokenType.HASH,
  '<': TokenType.LESS_THAN,
  '>': TokenType.GREATER_THAN,
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
  'include': TokenType.INCLUDE,
}