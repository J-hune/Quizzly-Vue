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
   createRoomSequence(sequenceId) {
      this.socket.emit("createRoomSequence", sequenceId)
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

   // Pour les questions uniquement (sans passer par une séquence)
   createRoomQuestion(questionId) {
      this.socket.emit("createRoomQuestion", questionId)
   }


   /* --------- Events Etudiants --------- */
   joinRoom(sequenceId) {
      this.socket.emit("joinRoom", sequenceId)
   }

   submitAnswer(answer) {
      this.socket.emit("submitAnswer", answer)
   }


}

export default new SocketioService();