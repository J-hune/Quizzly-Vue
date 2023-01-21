/**
 * Fetch l'api pour ajouter une question puis appelle le callback
 * @param {Object} question
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function addQuestion(question, callback) {
  const response = await fetch(process.env.VUE_APP_API_URL + "/questions/addQuestion", {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(question)
  });

  const data = await response.json();
  callback(data);
}

/**
 * Fetch l'api pour modifier une question puis appelle le callback
 * @param {Object} question
 * @param {function} callback
 * @return {Promise<void>}
 */
export async function editQuestion(question, callback) {
  const response = await fetch(process.env.VUE_APP_API_URL + "/questions/editQuestion/" + question.id, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(question)
  });

  const data = await response.json();
  callback(data);
}