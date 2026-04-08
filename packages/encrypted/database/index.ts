import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import Directory from "../../directory/index.ts";
import CustomError from "../../error/Error.ts";
import { createConnection } from "../../sqlite/index.ts";

const DIRECTORY = new Directory();
const __filename = fileURLToPath(import.meta.url);
const BASE_PATH = DIRECTORY.directoryPath(__filename);

const DATABASE_PATH = DIRECTORY.joinPath(BASE_PATH, "encrypted.db");
const MODELS_PATH = DIRECTORY.joinPath(BASE_PATH, "models");

const CONNECTION = createConnection(DATABASE_PATH);
CONNECTION.initialize();
await CONNECTION.syncTables([MODELS_PATH]);

const DATABASE = CONNECTION.get();

if (!DATABASE) {
    throw new CustomError("No se pudo inicializar la base de datos de encrypted", {
        cause: path.normalize(DATABASE_PATH),
        status: 500
    });
}

function ensureEncryptedSchema(db: DatabaseSync): void {
    type ColumnInfo = { name?: string };

    const COLUMNS = db.prepare("PRAGMA table_info(encripted)").all() as ColumnInfo[];
    const CURRENT = new Set(COLUMNS.map((column) => column.name).filter((name): name is string => !!name));

    if (!CURRENT.has("startsAt")) {
        db.exec("ALTER TABLE encripted ADD COLUMN startsAt INTEGER");
    }

    if (!CURRENT.has("endsAt")) {
        db.exec("ALTER TABLE encripted ADD COLUMN endsAt INTEGER");
    }

    if (!CURRENT.has("createdAt")) {
        db.exec("ALTER TABLE encripted ADD COLUMN createdAt INTEGER");
    }

    const NOW = Date.now();
    db.prepare("UPDATE encripted SET startsAt = COALESCE(startsAt, ?)").run(NOW);
    db.prepare("UPDATE encripted SET createdAt = COALESCE(createdAt, ?)").run(NOW);
}

const DATABASE_INSTANCE: DatabaseSync = DATABASE;
ensureEncryptedSchema(DATABASE_INSTANCE);

export { CONNECTION, DATABASE_INSTANCE as DATABASE, DATABASE_PATH, MODELS_PATH };
