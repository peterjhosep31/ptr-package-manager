interface PtrConfig {
    registry: "local" | "remote";
    remoteUrl?: string;
}
declare class Config {
    private configPath;
    private defaultConfig;
    constructor();
    read(): PtrConfig;
    write(config: Partial<PtrConfig>): void;
    setRemoteRegistry(url: string): void;
    setLocalRegistry(): void;
    getRegistryUrl(): string | null;
    isRemote(): boolean;
}
export default Config;
