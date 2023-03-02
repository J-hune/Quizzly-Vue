export async function addSequence(sequence, callback) {
   // Envoi de la requête au serveur avec la méthode POST
   const response = await fetch(process.env.VUE_APP_API_URL + "/sequences/addSequence", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify({titre: sequence.title, questions: sequence.questions})
   });

   const data = await response.json();
   callback(data);
}