import authRoutes from "./features/auth/auth.routes";
import chatRoutes from "./features/chat/chat.route";
import userRoutes from "./features/user/user.routes";
import AuthorizationRepo from "./shared/repositories/modules/encryption";
import server from "./shared/repositories/modules/server";
import RequestHandler from "./shared/repositories/modules/server/router";
import cors from 'cors';

export default server((app, server) => {
    cors();
    chatRoutes(server);

    const authenticationRepo = new AuthorizationRepo();
    const router = new RequestHandler({ router: app,  authenticationRepo, host: '/api' });

    router.extend('/auth', authRoutes);
    router.extend('/user', userRoutes);
});


