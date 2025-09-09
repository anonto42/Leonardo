import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';
import { RedisDB } from '../app/modules/Queue/redis';

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));

    //Register the user with the socket id
    socket.on("register", async ( userID: string) => {
      await RedisDB.set(`user:${userID}`,socket.id);
      logger.info( colors.yellow(`${userID} was added on socket: ${socket.id}`) );
    });

    // Send data to user
    socket.on("resend", ( data ) => {
      
      socket.to(data.data.socketId).emit("notification", {
        type: data.type,
        message: data.message,
        completedAt: data.data.completedAt
      })

    })

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
