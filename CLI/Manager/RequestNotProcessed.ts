import CustomError from "../../src/Error/Error.ts";
import Files from "../../src/Files/Files.ts";

class RequestNotProcessed {

    constructor() {
        Object.setPrototypeOf(this, RequestNotProcessed.prototype);
    }

    getCommands() {

        const COMMANTS = this.readFileRouter();
        console.log(COMMANTS);


    }

    readFileRouter(): string[] | undefined {

        const FILES = new Files();

        const CONTENTED: string =
            FILES.readFile(process.cwd() + '/CLI/index.ts');

        if (CONTENTED.length === 0)
            throw new CustomError('File content is empty');


        const COMMANTS: string[] | undefined
            = CONTENTED?.split('\n').filter(
                line => line.trim() !== '' && line.includes('case')
            ).map((line) => {

                const parts = line.split('"');
                if (parts?.[1] && typeof parts[1] === 'string')
                    return parts[1];
                return null;
            }).filter(
                (command): command is string => command !== null
            );


        return COMMANTS;
    }

}


export default RequestNotProcessed;
