import type { Columns, Tables } from "../../../sqlite/interfaces/interfaceModels";

class Encrypted implements Tables {

    columns(): Columns[] {
        const FIELDS: Columns[] = new Array;

        FIELDS.push({
            field: 'key',
            type: 'varchar',
            primary: true,
            length: 80
        })

        FIELDS.push({
            field: 'jump',
            type: 'varchar',
            length: 200,
            nullable: false
        });

        FIELDS.push({
            field: 'startsAt',
            type: 'int',
            nullable: false,
            index: true
        });

        FIELDS.push({
            field: 'endsAt',
            type: 'int',
            nullable: true,
            index: true
        });

        FIELDS.push({
            field: 'createdAt',
            type: 'int',
            nullable: false
        });

        return FIELDS;
    }

}

export default Encrypted;
