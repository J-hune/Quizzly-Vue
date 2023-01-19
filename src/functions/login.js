import router from "@/router";

export async function registerUser(user, callback) {
   const response = await fetch(process.env.VUE_APP_API_URL + "/login/signup", {
      method: "POST",
      mode: "cors",
      credentials: 'include',
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
      credentials: 'include',
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
   });

   const data = await response.json();
   callback(data);
}

export async function checkUserLogged(callback) {
   const response = await fetch(process.env.VUE_APP_API_URL + "/login/logged", {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: {
         "Accept": "application/json",
         "Access-Control-Allow-Credentials": "true",
      },
   });

   const data = await response.json();
   if (data.firstname && data.surname) {
      callback(data);
   } else {
      await router.push("/signin")
   }
}