import Directory from "../directory/Directory.ts";
import DataBase from "./DataBase.ts";

const DIRECTORY: Directory = new Directory();

function resolveDefaultDataBasePath(): string {
    return DIRECTORY.joinPath(
        DIRECTORY.baseNameProject(),
        "dataBase",
        DIRECTORY.baseNameProject() + ".db"
    );
}

function createDataBase(path?: string): DataBase {
    return new DataBase(path || resolveDefaultDataBasePath());
}

export { DataBase, createDataBase as createConnection };
export default DataBase;
