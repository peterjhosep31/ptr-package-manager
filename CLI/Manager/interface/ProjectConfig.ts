interface ProjectConfig {
    name: string;
    version: string;
    description: string;
    main: string;
    author: string;
    license: string;
    dependencies: Record<string, string>;
}

export type { ProjectConfig }
