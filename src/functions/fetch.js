const options = {
  method: "GET",
  credentials: "include",
  mode: "cors",
  headers: {
    "Accept": "application/json",
    "Access-Control-Allow-Credentials": "true"
  }
};

export async function fetchData(route) {
  try {
    const response = await fetch(process.env.VUE_APP_API_URL + route, options);
    const data = await response.json();
    return { data: data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}