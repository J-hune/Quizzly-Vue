import {io} from 'socket.io-client';

class SocketioService {
   socket;

   constructor() {
   }

   /* --------- Events Enseignant et Etudiants --------- */
   setupSocketConnection() {
      this.socket = io("http://localhost:5000/", {
         withCredentials: true
      });
   }

   disconnect() {
      if (this.socket) {
         this.socket.disconnect();
      }
   }


   /* --------- Events Enseignant --------- */
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


   /* --------- Events Etudiants --------- */
   joinRoom(sequenceId) {
      this.socket.emit("joinRoom", sequenceId)
   }


}

export default new SocketioService();