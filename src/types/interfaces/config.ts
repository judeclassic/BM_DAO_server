export interface SocketCorsSettingsInterface {
    cors: {
        origin: string,
        methods: string[],
        transports: string[],
        credentials: boolean
    },
    allowEIO3: boolean;
}

interface ConfigInterface {
    name: string;
    server: {
        port: number | string
    };
    db: {
        url: string
    },
    file: {
        cloud_name: string
        api_key: string,
        api_secret: string,
        secure: boolean
    },
    auth: {
        userAuthKey: string
        accessTokenSecret: string,
        adminAccessTokenSecret: string,
        verifyEmailSecret: string
        passwordResetSecret: string
    }
    options: {
        key: string
        cert: string
    }
    emailSmtp: {
        fromEmail: string;
        user: string;
        password: string;
        host: string;
    },
    socketCorsSettings: {
        cors: {
            origin: string,
            methods: string[],
            transports: string[],
            credentials: boolean
        },
        allowEIO3: boolean;
    },
    payment: {
        paystackSecretKey: string,
    }
}

export default ConfigInterface;