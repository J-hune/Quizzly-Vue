<template>
   <div class="background" :style="{backgroundColor: backgroundColor}" />
   <div class="container">

      <!-- Image de profil de l'étudiant -->
      <div class="image-container">
         <img class="cursor-pointer" :src="avatar" @click="handleImageClick" alt="avatar">
         <input
           type="file"
           id="imageUpload"
           style="display:none"
           @change="handleImageUpload"
         />
      </div>

      <div class="text-container">

         <!-- Nom, prénom, id de l'étudiant -->
         <div class="flex items-baseline gap-2">
            <p class="font-bold text-2xl">{{ name }}</p> <span>#{{ id }}</span>
         </div>

         <!-- Modification du mot de passe -->
         <h2 class="mt-10 mb-2 text-xl font-medium text-gray-900">Modifier le mot de passe</h2>
         <div>
            <input type="password" v-model="password"
                   class="w-3/5 text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                   placeholder="Nouveau mot de passe..." />
         </div>
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
         password: ""
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
      handleImageClick() {
         document.getElementById("imageUpload").click();
      },
      handleImageUpload(event) {
         this.file = event.target.files[0];

         // On limite la taille de l'image (< 200ko)
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

.container {
   position: relative;
}

.image-container {
   position: absolute;
   padding: 8px;
   width: 150px;
   height: 150px;
   border-radius: 50%;
   top: -42px;
   left: 40px;
   background-color: white;
}

.image-container img {
   border-radius: 50%;
   width: 100%;
   height: 100%;
   object-fit: cover;
}

.text-container {
   background-color: white;
   border-radius: 0 0 8px 8px;
   margin-top: 30px;
   margin-left: 215px;
   margin-bottom: 40px;
}
</style>