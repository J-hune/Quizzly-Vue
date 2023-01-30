<template>
   <navbar-component :firstname="firstname" :surname="surname" />
   <div class="grid h-screen">
      <div class="custom-background">
         <div class="custom-container mb-14">
            <div class="block bg-white shadow-lg rounded-lg">
               <div class="flex flex-wrap g-0">
                  <router-view/>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
// @ is an alias to /src
import { checkUserLogged } from "@/functions/login";
import NavbarComponent from "@/components/NavbarComponent";

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
   beforeCreate() {
      const props = this;
      checkUserLogged((user) => {
         props.firstname = user.firstname;
         props.surname = user.surname;
         props.type = user.type;
      });
   }
};
</script>

<style scoped>
.custom-background {
   margin-top: 84px;
   display: flex;
   justify-content: center;
}

.custom-container {
   width: 80%;
   margin-top: 4rem;
}

@media (max-width:1024px) {
   .custom-container {
      width: 90%;
      margin-top: 50px;
   }
}

@media (max-width:768px) {
   .custom-container {
      width: 100%;
      margin-top: 30px;
   }
}

</style>
