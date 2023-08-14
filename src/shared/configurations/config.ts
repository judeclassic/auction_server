import dotenv from 'dotenv';

process.env.NODE_ENV !== 'production' && dotenv.config();

const defaultConfig =  {
    name: process.env.APP_NAME || 'Auction',
    server: {
        port: process.env.PORT || 8081
    },
    db: {
        url: process.env.MONGODB_URL!
    },
    auth: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
        adminAccessTokenSecret: process.env.ADMIN_ACCESS_TOKEN_SECRET!,
    },
    socketCorsSettings: {
      cors: {
          origin: '*',
          methods: ['GET', 'POST'],
          transports: ['websocket', 'polling'],
          credentials: true
      },
      allowEIO3: true
    },
};

export default defaultConfig;