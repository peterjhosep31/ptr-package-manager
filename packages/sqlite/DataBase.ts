import { DatabaseSync } from "node:sqlite";
import Directory from "../directory/Directory.ts";
import CustomError from "../error/Error.ts";

class DataBase {

    private DIRECTORY: Directory | undefined;
    private db: DatabaseSync | undefined;
    private _path: string = "";

    private set path(
        value: string
    ) {

        if (!this.DIRECTORY)
            throw new CustomError('No se han inicializado las dependencias', {
                status: 500
            });

        const PATH = value.replaceAll(/[\/\\]/, this.DIRECTORY.separator);

        this._path = PATH;
    }

    private get path(): string {
        return this._path;
    }

    public constructor(
        path: string
    ) {

        this.DIRECTORY = new Directory();

        this.path = path;
    }

    public initialize() {

        if (!this.DIRECTORY)
            throw new CustomError('No se han inicializado las dependencias', {
                status: 500
            });

        if (!this.DIRECTORY.exists(this.path))
            this.DIRECTORY.create(this.path);

        this.db = new DatabaseSync(this.path);
    }

    public get(): DatabaseSync | undefined {
        return this.db;
    }

    public searchModels(
        path?: Array<string>
    ): string | null {

        // Validamos que este instanciada la dependencia
        if (!this.DIRECTORY)
            throw new CustomError('No se han inicializado las dependencias', {
                status: 500
            });

        // Validamos si se paso una ruta y si esta existe
        if (path)
            if (this.DIRECTORY?.exists(this.DIRECTORY.joinPath(...path)))
                return this.DIRECTORY.joinPath(...path);
            else
                throw new CustomError('La ruta proporcionada no existe', {
                    status: 404
                });

        // Validamos si una de las posibles rutas existe
        let possiblePath = new Array(
            new Array(
                'dateBase',
                'Models'
            ),
            new Array(
                'Models'
            ),
            new Array(
                'models'
            ),
            new Array(
                'DB',
                'Models'
            ),
            new Array(
                'db',
                'models'
            )
        ).filter((path: string[]) => {

            const PATH_ADSOLUTE: string | undefined
                = this.DIRECTORY?.joinPath(...path);

            return PATH_ADSOLUTE && this.DIRECTORY?.exists(PATH_ADSOLUTE)
        });

        if (possiblePath.length === 0 || !possiblePath[0])
            return null;

        return this.DIRECTORY.joinPath(...possiblePath[0]);

    }
}


export default DataBase;
