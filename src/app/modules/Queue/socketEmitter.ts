import { RedisDB } from "./redis";


// global.io is already set in your api server
export async function sendSocketEvent(userId: string, event: string, data: any) {
  try {
    const socketId = await RedisDB.get(`user:${userId}`);
    if (!socketId) return console.log(`❌ No socket found for user ${userId}`);

    // @ts-ignore
    global.io.to(socketId).emit(event, data);
    console.log(`📢 Sent event "${event}" to user ${userId}`);
  } catch (err) {
    console.error("Socket emit error:", err);
  }
}
