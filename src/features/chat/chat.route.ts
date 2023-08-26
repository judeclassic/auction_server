import { Server } from 'socket.io';
import defaultConfig from '../../shared/configurations/config';
import { IMessage } from '../../shared/types/request/message';

const chatRoutes = (server: any) => {
    const io = new Server(server, defaultConfig.socketCorsSettings);

    const connection = io.of('/auction');
    
    const images = [
        '/dark1.jpeg',
        '/head.png',
    ];

    let currentImage = 0;
    let currentRandomNumber = 300;
    let theNegative = false;

    setInterval(() => {
        let randomNumber = randomIntFromInterval(3, 10);
        if (!theNegative && (randomNumber === 3 || randomNumber === 4)) randomNumber = - randomNumber;
        if (theNegative && !(randomNumber === 3 || randomNumber === 4)) randomNumber = - randomNumber;

        if (currentRandomNumber > 1400) {
            theNegative = true;
        } else if (currentRandomNumber < 1250) {
            theNegative = false;
        }

        currentRandomNumber = currentRandomNumber + randomNumber;
        connection.emit('current-users', (currentRandomNumber));
    }, (2 * 1000) );

    setInterval(() => {
        connection.emit('images', {
            name: generateRandomString(6),
            bid: generateRandomNumberString(8),
            image: images[currentImage]
        });
        if (currentImage === images.length - 1) {
            currentImage = 0;
            return;
        }
        currentImage++;
    }, (randomIntFromInterval(60000, 90000)));

    connection.on('connection', (socket) => {
        socket.on('send-message', (message: IMessage) => {
            socket.broadcast.emit('receive-message', message);
        });
    });
}

export default chatRoutes;

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateRandomNumberString(length: number): string {
    const characters = '0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
  
    return randomString;
}

function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
  
    return randomString;
}