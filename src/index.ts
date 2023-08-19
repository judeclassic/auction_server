import authRoutes from "./features/auth/auth.routes";
import chatRoutes from "./features/chat/chat.route";
import userRoutes from "./features/user/user.routes";
import AuthorizationRepo from "./shared/repositories/modules/encryption";
import server from "./shared/repositories/modules/server";
import RequestHandler from "./shared/repositories/modules/server/router";
import cors from 'cors';
import { defaultLogger } from "./shared/repositories/modules/logger";
import DBConnection from "./shared/repositories/modules/database";
import dotEnv from 'dotenv'


dotEnv.config();
const dBConnection = new DBConnection();
dBConnection.connect();

export default server((app, server) => {
    cors();
    
    const authenticationRepo = new AuthorizationRepo();
    const router = new RequestHandler({ router: app,  authenticationRepo, host: '/api' });
    
    router.extend('/user/auth', authRoutes);
    router.extend('/user/profile', userRoutes);

    if (process.env.NODE_ENV === 'development') defaultLogger.useExpressMonganMiddleWare(app);
    if (process.env.NODE_ENV === 'development') defaultLogger.checkRoutes(router);

    chatRoutes(server);
});


