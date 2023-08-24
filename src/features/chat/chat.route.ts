import { Server } from 'socket.io';
import defaultConfig from '../../shared/configurations/config';
import { IMessage } from '../../shared/types/request/message';

const chatRoutes = (server: any) => {
    const io = new Server(server, defaultConfig.socketCorsSettings);

    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters[randomIndex];
        }
      
        return randomString;
    }

    const connection = io.of('/auction');

    const images = [
        '/dark1.jpeg',
        '/head.png',
    ];

    let currentImage = 0;

    setInterval(() => {
        connection.emit('images', {
            name: generateRandomString(6),
            bid: generateRandomString(8),
            image: images[currentImage]
        });
        if (currentImage === images.length - 1) {
            currentImage = 0;
            return;
        }
        currentImage++;
    }, 1000 * 60 * 90);

    connection.on('connection', (socket) => {
        socket.on('send-message', (message: IMessage) => {
            socket.broadcast.emit('receive-message', message);
        });
    });
}

export default chatRoutes;