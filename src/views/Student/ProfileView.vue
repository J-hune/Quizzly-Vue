<template>
   <!-- Background du profil (la couleur est celle majoritaire de l'avatar) -->
   <div class="background" @click="handleBackgroundClick"
        :class="{enabled: backgroundImage, 'cursor-pointer': discordEnabled}"
        :style="{backgroundColor: backgroundColor, backgroundImage: `url(${backgroundImage})`}" />

   <!-- Input pour ce dont on ne doit pas prononcer le nom -->
   <input
     type="file"
     id="backgroundUpload"
     style="display:none"
     accept="image/png, image/gif, image/jpeg"
     @change="handleBackgroundUpload"
   />

   <div class="discord-container">

      <!-- Image de profil de l'étudiant -->
      <div class="image-container">
         <img class="cursor-pointer" :src="avatar" @click="handleImageClick" alt="avatar">
         <input
           type="file"
           id="imageUpload"
           style="display:none"
           accept="image/png, image/jpeg"
           @change="handleImageUpload"
         />
      </div>

      <!-- Badges de l'utilisateur (Ref à Discord) -->
      <!-- Pour info, on a choisi la squad bravery car les 4 membres du groupe sont dans la Bravery -->
      <div class="discord" @click="discordEnabled = true">
         <img src="@/assets/img/bravery.svg" alt="Bravery icon">
         <img src="@/assets/img/developer.svg" alt="Developer icon">
         <img src="@/assets/img/nitro.svg" alt="Nitro icon">
      </div>


      <div class="text-container">

         <!-- Nom, prénom, id de l'étudiant -->
         <div class="username sm:flex items-baseline gap-2">
            <p class="font-bold text-2xl">{{ name }}</p> <span>#{{ id }}</span>
         </div>

         <!-- Modification du mot de passe -->
         <h2 class="mt-8 mb-2 text-xl font-medium text-gray-900">Modifier le mot de passe</h2>
         <div>
            <input type="password" v-model="password"
                   class="w-full md:w-4/5 lg:w-3/5 text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                   placeholder="Nouveau mot de passe..." />
         </div>

         <!-- Bouton permettant de modifier le mot de passe -->
         <button @click="updatePassword"
                 class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-7 rounded-lg">
            Mettre à jour le mot de passe
         </button>
      </div>
   </div>
</template>

<script>
import image from "@/assets/img/f2.png";
import { editImageProfile, editPassword, getColorFromImage } from "@/functions/profile";
import { useToast } from "vue-toastification";
import { mapMutations } from "vuex";

export default {
   name: "ProfileView",
   data: function() {
      return {
         id: this.$store.getters.getUserId,
         name: this.$store.getters.getUserName,
         avatar: this.$store.getters.getUserAvatar || image,
         image: image,
         backgroundColor: "#ffffff",
         backgroundImage: null,
         password: "",
         discordEnabled: false
      };
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   async created() {
      // On calcule la couleur de l'arrière-plan à partir de l'image de profil
      this.backgroundColor = await getColorFromImage(this.avatar);
   },
   methods: {
      // On utilise la méthode setUserAvatar de la mutation pour mettre à jour l'avatar dans le store
      ...mapMutations(["setUserAvatar"]),

      /**
       * Vérifie la validité du mot de passe et le modifie dans le système si valide.
       * @returns {string|number}
       */
      updatePassword: function() {
         const lowercaseRegex = /[a-z]/;
         const uppercaseRegex = /[A-Z]/;
         const numberRegex = /[0-9]/;

         // Si le mot de passe est trop court
         if (this.password.length < 8) {
            return this.toast.error("Le mot de passe doit contenir au moins 8 caractères");
         }

         // Si le mot de passe n'a pas assez de minuscules
         if (!lowercaseRegex.test(this.password)) {
            return this.toast.error("Le mot de passe doit contenir au moins une lettre minuscule");
         }

         // Si le mot de passe n'a pas assez de majuscules
         if (!uppercaseRegex.test(this.password)) {
            return this.toast.error("Le mot de passe doit contenir au moins une lettre majuscule");
         }

         // Si le mot de passe n'a pas assez de chiffres
         if (!numberRegex.test(this.password)) {
            return this.toast.error("Le mot de passe doit contenir au moins un chiffre");
         }

         editPassword(this.password, this.toast, () => {
            this.password = "";
         });
      },

      /**
       * Gère l'événement click de l'image et déclenche la sélection de l'image à partir du système de fichiers.
       * @returns {void}
       */
      handleImageClick() {
         document.getElementById("imageUpload").click();
      },

      /**
       * Gère l'événement click du background et déclenche la sélection de l'image à partir du système de fichiers.
       * @returns {void}
       */
      handleBackgroundClick() {
         if (this.discordEnabled) document.getElementById("backgroundUpload").click();
      },

      /**
       * Gère l'événement de téléchargement de l'image et met à jour l'URL de l'image si la taille est correcte.
       * @param {object} event - L'événement d'upload d'image.
       * @returns {void}
       */
      handleImageUpload(event) {
         this.file = event.target.files[0];

         // On limite la taille de l'image à 200ko
         if (this.file.size > 200480) {
            return this.toast.error("La taille du fichier ne doit pas être supérieure à 200ko");
         }

         const reader = new FileReader();
         reader.onload = () => {
            this.imageUrl = reader.result;
            this.updateImage();
         };
         reader.readAsDataURL(this.file);
      },

      /**
       * Gère l'événement de téléchargement de l'image de fond et met à jour l'URL de l'image.
       * @param {object} event - L'événement d'upload d'image.
       * @returns {void}
       */
      handleBackgroundUpload(event) {
         const file = event.target.files[0];
         const reader = new FileReader();
         reader.onload = () => {
            this.backgroundImage = reader.result;
         };
         reader.readAsDataURL(file);
      },

      /**
       * Met à jour l'image du profil,
       * Envoie la nouvelle image au serveur,
       * Récupère la couleur d'arrière-plan,
       * Met à jour l'avatar dans le store.
       * @async
       * @returns {Promise<void>}
       */
      async updateImage() {
         await editImageProfile(this.file, this.toast, async (base64) => {
            // On modifie l'avatar sur la page
            this.avatar = base64;

            // On modifie la couleur de l'arrière-plan
            this.backgroundColor = await getColorFromImage(this.avatar);

            // On modifie l'avatar dans le store
            this.$store.dispatch("updateUserAvatar", base64);
         });
      }
   }
};
</script>

<style scoped>
.background {
   height: 110px;
   border-radius: 8px 8px 0 0;
   width: 100%;
}

.background.enabled {
   height: 150px;
   background-size: cover;
   background-position: center;
   background-repeat: no-repeat;
}

.discord-container {
   width: 100%;
   position: relative;
   background-color: #F2F1F4;
   border-radius: 0 0 8px 8px;
}

.image-container {
   position: absolute;
   padding: 8px;
   width: 120px;
   height: 120px;
   border-radius: 50%;
   top: -60px;
   left: 40px;
   background-color: #F2F1F4;
}

.image-container img {
   border-radius: 50%;
   width: 100%;
   height: 100%;
   object-fit: cover;
}

.discord {
   position: absolute;
   top: 12px;
   right: 16px;
   width: fit-content;
   border-radius: 8px;
   cursor: pointer;

   display: flex;
   gap: 4px;
   background-color: white;
   padding: 5px;
}

.text-container {
   padding: 22px;
   background-color: white;
   border-radius: 10px;
   margin: 80px 40px 40px 40px;
}


/* Format md */
@media (max-width: 768px) {
   .background {
      border-radius: unset;
   }

   .discord-container {
      border-radius: unset;
   }
}


@media (max-width: 640px) {
   .text-container {
      margin: 80px 20px 40px 20px;
   }
}
</style>