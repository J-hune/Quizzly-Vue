const options = {
   method: "GET",
   credentials: "include",
   mode: "cors",
   headers: {
      "Accept": "application/json",
      "Access-Control-Allow-Credentials": "true"
   }
};

/**
 * Fetches data from the API with the specified route.
 * @param {string} route - The API route to fetch data from.
 * @returns {Promise<{data: object|null, error: Error|null}>} - A promise that resolves to an object containing the fetched data and any error that may have occurred.
 */
export async function fetchData(route) {
   try {
      const response = await fetch(process.env.VUE_APP_API_URL + route, options);
      const data = await response.json();
      return { data: data, error: null };
   } catch (e) {
      return { data: null, error: e };
   }
}