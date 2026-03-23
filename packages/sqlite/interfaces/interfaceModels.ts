type Columns = {
    field: string,
    type: 'varchar' | 'int',
    length?: number,
    default?: string | number,
    primary?: boolean,
    nullable?: boolean,
    unique?: boolean,
    index?: boolean
}

interface Tables {

    columns(): Columns[];


};


export type { Columns, Tables };
