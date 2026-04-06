import type { Columns, Tables } from "../../sqlite/interfaces/interfaceModels";

class Encrypted implements Tables {

    columns(): Columns[] {
        const FIELDS: Columns[] = new Array;

        FIELDS.push({
            field: 'date',
            type: 'varchar',
            primary: true,
            length: 8
        })

        FIELDS.push({
            field: 'salt',
            type: 'int',
            length: 2
        });

        return FIELDS;
    }

}

// 02042026
