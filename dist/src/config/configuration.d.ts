declare const _default: () => {
    port: number;
    mongoUri: string | undefined;
    jwt: {
        secret: string | undefined;
        accessTtl: string;
        refreshTtlDays: number;
    };
};
export default _default;
