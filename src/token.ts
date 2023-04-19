import { TokenType } from "./tokens";
import { Literal } from "./types";

export default class Token {
    type: TokenType
    literal?: Literal
    constructor(type: TokenType, literal?: Literal) {
        this.type = type;
        this.literal = literal;
    }
}