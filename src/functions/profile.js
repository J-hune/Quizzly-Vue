/**
 * Convertit une image en URL de données base64
 * @async
 * @param {HTMLImageElement} image - L'élément image à convertir
 * @returns {Promise<string>} - L'URL de données base64 de l'image
 */
function imageToBase64(image) {
   const canvas = document.createElement("canvas");
   canvas.width = image.width;
   canvas.height = image.height;

   // Obtenir le contexte de dessin du canvas
   const context = canvas.getContext("2d");
   // Dessiner l'image sur le canvas
   context.drawImage(image, 0, 0);

   // Récupérer l'URL de données base64 du canvas
   return canvas.toDataURL("image/png");
}

/**
 * Convertit un fichier en URL de données base64
 * @async
 * @param {File} file - Le fichier image à convertir
 * @returns {string} - L'URL de données base64 de l'image
 */
async function fileToBase64(file) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
         const image = new Image();
         image.src = reader.result;
         image.onload = () => {
            const base64 = imageToBase64(image);
            resolve(base64);
         };
         image.onerror = reject;
      };
      reader.onerror = reject;
   });
}

/**
 * Récupère la couleur dominante d'une image à partir de son URL ou de sa représentation en base64
 * @param {string} urlOrBase64 - L'URL ou la représentation en base64 de l'image
 * @returns {Promise<string>} - Une promesse qui renvoie la couleur dominante sous forme de chaîne hexadécimale
 */
export async function getColorFromImage(urlOrBase64) {
   const img = new Image();
   img.crossOrigin = "Anonymous";

   // Vérifier si c'est une URL ou une base64
   if (urlOrBase64.startsWith("http") || urlOrBase64.startsWith("data:")) {
      img.src = urlOrBase64;
   } else {
      img.src = imageToBase64(urlOrBase64);
   }

   return new Promise((resolve, reject) => {
      img.onload = function() {
         const canvas = document.createElement("canvas");
         const ctx = canvas.getContext("2d");

         canvas.width = this.naturalWidth;
         canvas.height = this.naturalHeight;

         ctx.drawImage(this, 0, 0);

         const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

         let colorCount = {};
         let maxColor = "";
         let maxCount = 0;

         for (let i = 0; i < pixels.length; i += 4) {
            const color =
               "#" +
               Array.from(pixels.slice(i, i + 3))
                  .map((x) => x.toString(16).padStart(2, "0"))
                  .join("");

            if (colorCount[color]) {
               colorCount[color]++;
            } else {
               colorCount[color] = 1;
            }

            if (colorCount[color] > maxCount) {
               maxCount = colorCount[color];
               maxColor = color;
            }
         }

         resolve(maxColor);
      };

      img.onerror = function(err) {
         reject(err);
      };
   });
}

/**
 * Édite l'image de profil de l'utilisateur connecté en envoyant l'image au serveur.
 * @async
 * @param {File} image - Le fichier image à envoyer au serveur.
 * @param {Object} toast - L'objet toast utilisé pour afficher les messages d'erreur/succès.
 * @param {Function} callback - La fonction callback appelée après la mise à jour de l'avatar.
 * @returns {Promise<void>}
 */
export async function editImageProfile(image, toast, callback) {
   // Convertit l'image en base64 en utilisant la fonction fileToBase64.
   const base64 = await fileToBase64(image);

   // Envoie une requête POST pour mettre à jour l'avatar sur le serveur.
   const response = await fetch(process.env.VUE_APP_API_URL + "/students/editAvatar", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify({ avatar: base64 })
   });

   // Analyse la réponse de la requête.
   const responseData = await response.json();
   if (responseData.success) {
      toast.success("L'avatar a été mis à jour");
      callback(base64);
   } else {
      toast.error("Une erreur a eu lieu lors de la mise à jour de l'avatar");
   }
}

/**
 * Édite le mot de passe de l'utilisateur.
 * @async
 * @param {string} password - Le nouveau mot de passe.
 * @param {object} toast - L'objet toast permettant d'afficher des messages à l'utilisateur.
 * @param {function} callback - La fonction de rappel à exécuter après la mise à jour réussie du mot de passe.
 * @returns {void}
 */
export async function editPassword(password, toast, callback) {

   // Envoi de la requête au serveur avec la méthode POST
   const response = await fetch(process.env.VUE_APP_API_URL + "/login/students/editPassword", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: password })
   });

   // Récupération de la réponse du serveur
   const responseData = await response.json();
   if (responseData.success) {
      toast.success("Le mot de passe a été mis à jour");
      callback();
   } else {
      toast.error("Une erreur a eu lieu lors de la mise à jour du mot de passe");
   }
}