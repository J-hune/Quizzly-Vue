<template>
   <!-- Navbar -->
   <navbar-component />

   <div class="custom-color grid h-screen">
      <div class="custom-background">
         <div class="custom-container mb-14">
            <div :class="backgroundClass">
               <div class="flex flex-wrap g-0">

                  <!-- Suite de la route -->
                  <router-view />
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import NavbarComponent from "@/components/Navbar/NavbarComponent";

export default {
   name: "HomeView",
   components: {
      NavbarComponent
   },
   data() {
      return {
         firstname: null,
         surname: null,
         type: null
      };
   },
   computed: {
      backgroundClass() {
         if (this.$route.name === "statistics" || this.$route.name === "studentStatistics") {
            return "";
         } else {
            return "custom-card";
         }
      }
   }
};
</script>

<style>
.custom-background {
   margin-top: 84px;
   display: flex;
   justify-content: center;
}

.custom-color > *:has(.div-rgb) {
   background-color: #2a1634; /* changer cette valeur à la couleur souhaitée */
}

.custom-container {
   width: 80%;
   margin-top: 4rem;
}

@media (max-width: 1024px) {
   .custom-container {
      width: 90%;
      margin-top: 50px;
   }
}

@media (max-width: 768px) {
   .custom-container {
      width: 100%;
      margin-top: 30px;
   }
}

.custom-card {
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   background: white;
}

@media (max-width: 768px) {
   .custom-card {
      margin: 0 24px;
   }
}

@media (max-width: 640px) {
   .custom-card {
      margin: 0 12px;
   }
}
</style>
