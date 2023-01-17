export async function registerUser(user, callback) {
  const response = await fetch(process.env.VUE_APP_API_URL + "/login/signup", {
    method: "POST",
    mode: "cors",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  const data = await response.json();
  callback(data);
}

export async function logUser(user, callback) {
  const response = await fetch(process.env.VUE_APP_API_URL + "/login/signin", {
    method: "POST",
    mode: "cors",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  const data = await response.json();
  callback(data);
}