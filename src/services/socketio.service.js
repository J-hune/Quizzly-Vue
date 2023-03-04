import {io} from 'socket.io-client';

class SocketioService {
   socket;

   constructor() {
   }

   setupSocketConnection() {
      this.socket = io("http://localhost:5000/", {
         withCredentials: true
      });
   }

   createRoom(sequenceId) {
      this.socket.emit("createRoom", sequenceId)
   }

   nextQuestion() {
      this.socket.emit("nextQuestion")
   }

   askCorrection() {
      this.socket.emit("askCorrection")
   }

   askStopResponses() {
      this.socket.emit("askStopResponses")
   }

   disconnect() {
      if (this.socket) {
         this.socket.disconnect();
      }
   }
}

export default new SocketioService();