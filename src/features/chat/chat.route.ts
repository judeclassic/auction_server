import { Server } from 'socket.io';
import defaultConfig from '../../shared/configurations/config';
import { IMessage } from '../../shared/types/request/message';

const chatRoutes = (server: any) => {
    const io = new Server(server, defaultConfig.socketCorsSettings);

    const connection = io.of('/auction');
    
    // const messages = [
    //     'dragon',
    //     'goat',
    //     'lion',
    //     'fowl',
    //     'turkey',
    //     'laugh',
    //     'be me',
    //     'hahaha',
    // ]
    // let currentMessage = 0;

    // setInterval(() => {
    //     connection.emit('receive-message', {
    //         name: 'Abdul',
    //         message: messages[currentMessage],
    //         createdAt: (new Date()).toISOString()
    //     } as IMessage);
    //     if (currentMessage === messages.length - 1) {
    //         currentMessage = 0;
    //         return;
    //     }
    //     currentMessage++;
    // }, 8000);

    connection.on('connection', (socket) => {
        socket.on('send-message', (message: IMessage) => {
            socket.broadcast.emit('receive-message', message);
        });
    });
}

export default chatRoutes;