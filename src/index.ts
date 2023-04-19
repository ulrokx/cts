import {readFileSync} from "fs"
import Lexer from "./lexer"

const sourceFromFile = (filename: string) => {
    return readFileSync(filename).toString()
}

const main = () => {
    const source = sourceFromFile("./samples/hello.c")
    const lexer = new Lexer(source)
    const tokens = lexer.lex()
    console.log(tokens)
    console.log(lexer.error)
}

main();