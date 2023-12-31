import defaultConfig from "../../../configurations/config";

export default class HttpServer {
    options: any;
    port: number | string;
    app: any;
    httpsServer: any;
    
    constructor({app}:{app: any}) {
        this.options = defaultConfig.socketCorsSettings;
        this.port = defaultConfig.server.port;
        this.app = app;
        this.test(app);
    }

    private test(app: any) {
        app.get('/test', (_req: any, res: any) =>{
            res.send('server started');
        });
    }

    production() {
        const http = require('http');
        this.httpsServer = http.createServer(this.app);
        this.httpsServer.listen(this.port, () => console.log(`Server in Development Mode and Listening on port ${this.port}`));

        return this.httpsServer;
    }

    close = () => {
        this.httpsServer.close();
    }
}