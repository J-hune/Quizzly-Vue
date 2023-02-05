import router from "@/router";

/**
 * Fetch l'api pour login/enregistrer l'utilisateur puis appelle le callback
 * @param {Object} user
 * @param {('teacher'|'student')} userType
 * @param {('signin'|'signup')} action
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function logUser(user, userType, action, callback) {
   let url = (userType === "teacher") ?
      process.env.VUE_APP_API_URL + "/login/enseignants/" + action
      : process.env.VUE_APP_API_URL + "/login/etudiants/" + action;

   const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
   });

   const data = await response.json();
   callback(data);
}

/**
 * Fetch l'api pour vérifier si l'utilisateur existe
 * Si non, il est redirigé vers la page de login
 * Si oui, callback()
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function checkUserLogged(callback) {
   const response = await fetch(process.env.VUE_APP_API_URL + "/login/enseignants/logged", {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: {
         "Accept": "application/json",
         "Access-Control-Allow-Credentials": "true"
      }
   });

   const data = await response.json();

   // Si l'utilisateur existe
   if (data.firstname && data.surname) {
      callback(data);
   } else {
      await router.push("/signin");
   }
}