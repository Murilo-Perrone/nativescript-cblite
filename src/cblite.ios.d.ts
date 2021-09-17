import { Common } from './cblite.common';
export declare class Utils {
    static startCBLListener(listenPort: number): string;
}
export declare class CBLite extends Common {
    constructor(databaseName: string);
    private static listenerUrl;
    static initCBLite(): string;
}
