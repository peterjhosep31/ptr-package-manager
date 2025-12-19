import Files from "../../src/Files/Files.ts";

class RequestNotProcessed {

    constructor() {
        Object.setPrototypeOf(this, RequestNotProcessed.prototype);
    }

    getCommands() {

        this.readFileRouter();
    }

    readFileRouter() {

        const FILES = new Files();

        const CONTENTED: string | null =
            FILES.readFile(process.cwd() + '/CLI/index.ts');

        const LINES: (string | undefined)[] | undefined = CONTENTED?.split('\n').filter(
            line => line.trim() !== '' && line.includes('case')
        ).map((line) => {
            const parts = line.split('"');
            // console.log(parts)
            return parts[1];
        })

        console.log(LINES);


    }

}


export default RequestNotProcessed;
