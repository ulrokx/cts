import {readFileSync} from "fs"

const sourceFromFile = (filename: string) => {
    return readFileSync(filename).toString()
}

const main = () => {
    const source = sourceFromFile("hello.c")
    console.log(source)
}

main();