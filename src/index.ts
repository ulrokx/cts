import {readFileSync} from "fs"
import Lexer from "./lexer"

const sourceFromFile = (filename: string) => {
    return readFileSync(filename).toString()
}

const main = () => {
    const source = sourceFromFile("./samples/hello.c")
    const tokens = new Lexer(source).lex();
    console.log(tokens)
}

main();