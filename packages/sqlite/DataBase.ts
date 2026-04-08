import { DatabaseSync } from "node:sqlite";
import Directory from "../directory/Directory.ts";
import CustomError from "../error/Error.ts";
import Files from "../files/Files.ts";
import CreateTables from "./tables/CreateTables.ts";

class DataBase {

    private DIRECTORY: Directory | undefined;
    private FILES: Files | undefined;
    private db: DatabaseSync | undefined;
    private _path: string = "";

    private set path(
        value: string
    ) {

        if (!this.DIRECTORY)
            throw new CustomError('No se han inicializado las dependencias', {
                status: 500
            });

        const PATH = value.replace(/[\/\\]/g, this.DIRECTORY.separator);

        this._path = PATH;
    }

    private get path(): string {
        return this._path;
    }

    public constructor(
        path: string
    ) {

        this.DIRECTORY = new Directory();
        this.FILES = new Files();

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

    public createTableBaseFile(
        modelsPath: string,
        tableName: string
    ): string {

        if (!this.DIRECTORY || !this.FILES)
            throw new CustomError('No se han inicializado las dependencias', {
                status: 500
            });

        if (!modelsPath || typeof modelsPath !== "string")
            throw new CustomError('La ruta de modelos es inválida', {
                status: 422
            });

        if (!tableName || typeof tableName !== "string")
            throw new CustomError('El nombre de tabla es inválido', {
                status: 422
            });

        const NORMALIZED_MODELS_PATH = modelsPath.replace(/[\/\\]/g, this.DIRECTORY.separator);

        if (!this.DIRECTORY.exists(NORMALIZED_MODELS_PATH)) {
            this.DIRECTORY.createDirectory(NORMALIZED_MODELS_PATH);
        }

        const TABLE_FILE_PATH = this.DIRECTORY.joinPath(
            NORMALIZED_MODELS_PATH,
            `${tableName}.ts`
        );

        if (this.DIRECTORY.exists(TABLE_FILE_PATH))
            throw new CustomError('El archivo base de la tabla ya existe', {
                cause: TABLE_FILE_PATH,
                status: 409
            });

        const TEMPLATE = `type Column = {
    field: string;
    type: "varchar" | "int";
    length?: number;
    default?: string | number;
    primary?: boolean;
    nullable?: boolean;
    unique?: boolean;
    index?: boolean;
};

class TableModel {
    public columns(): Column[] {
        return [
            {
                field: "id",
                type: "int",
                primary: true
            }
        ];
    }
}

export default TableModel;
`;

        this.FILES.write(TABLE_FILE_PATH, TEMPLATE);

        return TABLE_FILE_PATH;
    }

    public async syncTables(
        path?: Array<string>
    ): Promise<string[]> {

        if (!this.db)
            throw new CustomError('No hay conexión activa a la base de datos', {
                status: 500
            });

        const MODELS_PATH = this.searchModels(path);

        if (!MODELS_PATH)
            throw new CustomError('No se encontró el directorio de modelos', {
                status: 404
            });

        const TABLES = new CreateTables();
        return TABLES.createFromDirectory(this.db, MODELS_PATH);
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
