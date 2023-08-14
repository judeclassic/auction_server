import { Server } from 'socket.io';
import defaultConfig from '../../shared/configurations/config';
import { IMessage } from '../../shared/types/request/message';

const chatRoutes = (server: any) => {
    const io = new Server(server, defaultConfig.socketCorsSettings);

    const connection = io.of('/auction');

    connection.on('connection', (socket) => {

        socket.on('send-message', (message: IMessage) => {
            socket.broadcast.emit('receive-message', message);
        });
    });
}

export default chatRoutes;