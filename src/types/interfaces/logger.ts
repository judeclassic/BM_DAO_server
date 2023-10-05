import RouterInterface from "./router";

interface LoggerInterface {
    warn: (message: string) => void;

    init: (message: string) => void;

    info: (message: string) => void;

    debug: (message: string) => void;

    error: (message: string) => void;

    setUp: (message: string) => void;
    
    inform: (message: string) => void;

    useExpressMonganMiddleWare: (route: RouterInterface) => void;
}

export default LoggerInterface;