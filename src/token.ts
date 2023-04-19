import { TokenType } from "./tokens";
import { Literal } from "./types";

export default class Token {
    type: TokenType
    literal?: Literal
    value?: any
    constructor(type: TokenType, literal?: Literal, value?: any) {
        this.type = type;
        this.literal = literal;
        this.value = value;
    }
}