import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import Directory from "../../directory/Directory.ts";
import CustomError from "../../error/Error.ts";
import type { Columns, Tables } from "../interfaces/interfaceModels.ts";

class CreateTables {

    private DIRECTORY: Directory;

    public constructor() {
        this.DIRECTORY = new Directory();
    }

    private normalizeIdentifier(value: string): string {
        return value.replace(/[^a-zA-Z0-9_]/g, "_");
    }

    private resolveSqlType(column: Columns): string {
        if (column.type === "int") {
            return "INTEGER";
        }

        if (column.length && column.length > 0) {
            return `VARCHAR(${column.length})`;
        }

        return "TEXT";
    }

    private formatDefault(column: Columns): string {
        if (column.default === undefined) {
            return "";
        }

        if (typeof column.default === "number") {
            return ` DEFAULT ${column.default}`;
        }

        const escaped = column.default.replace(/'/g, "''");
        return ` DEFAULT '${escaped}'`;
    }

    private buildColumnsSql(columns: Columns[]): string {
        if (!columns.length) {
            throw new CustomError("No se definieron columnas para la tabla", {
                status: 422
            });
        }

        return columns.map((column) => {
            const fieldName = this.normalizeIdentifier(column.field);
            const sqlType = this.resolveSqlType(column);
            const primary = column.primary ? " PRIMARY KEY" : "";
            const unique = column.unique ? " UNIQUE" : "";
            const nullable = column.nullable === false ? " NOT NULL" : "";
            const defaultValue = this.formatDefault(column);

            return `${fieldName} ${sqlType}${primary}${unique}${nullable}${defaultValue}`;
        }).join(", ");
    }

    private buildTableSql(
        tableName: string,
        columns: Columns[]
    ): string {
        const normalizedTableName = this.normalizeIdentifier(tableName);
        const tableColumns = this.buildColumnsSql(columns);

        return `CREATE TABLE IF NOT EXISTS ${normalizedTableName} (${tableColumns});`;
    }

    private buildIndexesSql(
        tableName: string,
        columns: Columns[]
    ): string[] {
        const normalizedTableName = this.normalizeIdentifier(tableName);

        return columns
            .filter((column) => column.index)
            .map((column) => {
                const columnName = this.normalizeIdentifier(column.field);
                const indexName = `idx_${normalizedTableName}_${columnName}`;

                return `CREATE INDEX IF NOT EXISTS ${indexName} ON ${normalizedTableName} (${columnName});`;
            });
    }

    private extractTableName(filePath: string): string {
        const fileName = this.DIRECTORY.baseName(filePath);
        const extension = this.DIRECTORY.extension(fileName);

        return fileName.replace(extension, "");
    }

    private async importModel(filePath: string): Promise<Tables> {
        const module = await import(filePath);
        const Model = module.default;

        if (!Model) {
            throw new CustomError("El archivo de modelo no tiene export default", {
                cause: `Archivo: ${filePath}`,
                status: 422
            });
        }

        const instance = new Model() as Tables;

        if (typeof instance.columns !== "function") {
            throw new CustomError("El modelo no implementa el método columns()", {
                cause: `Archivo: ${filePath}`,
                status: 422
            });
        }

        return instance;
    }

    public async createFromFile(
        db: DatabaseSync,
        filePath: string
    ): Promise<string> {
        const model = await this.importModel(filePath);
        const tableName = this.extractTableName(filePath);
        const columns = model.columns();
        const tableSql = this.buildTableSql(tableName, columns);
        const indexesSql = this.buildIndexesSql(tableName, columns);

        db.exec(tableSql);
        indexesSql.forEach((sql) => db.exec(sql));

        return tableName;
    }

    public async createFromDirectory(
        db: DatabaseSync,
        modelsPath: string
    ): Promise<string[]> {
        if (!this.DIRECTORY.exists(modelsPath)) {
            throw new CustomError("El directorio de modelos no existe", {
                cause: `Ruta: ${modelsPath}`,
                status: 404
            });
        }

        const files = this.DIRECTORY
            .getDirectoryContents(modelsPath)
            .files
            .filter((filePath) => {
                const extension = path.extname(filePath).toLowerCase();
                return extension === ".ts" || extension === ".js";
            });

        const createdTables: string[] = [];

        for (const filePath of files) {
            const tableName = await this.createFromFile(db, filePath);
            createdTables.push(tableName);
        }

        return createdTables;
    }
}

export default CreateTables;
