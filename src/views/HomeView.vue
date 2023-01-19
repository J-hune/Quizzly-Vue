<template>
   <navbar-component :firstname="firstname" :surname="surname" />
   <div class="grid h-screen custom-background">
      <LabelsComponent :auth="firstname" />
   </div>
</template>

<script>
// @ is an alias to /src
import LabelsComponent from "@/components/LabelsComponent.vue";
import { checkUserLogged } from "@/functions/login";
import NavbarComponent from "@/components/NavbarComponent";

export default {
   name: "HomeView",
   components: {
      NavbarComponent,
      LabelsComponent
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

<style>
.custom-background {
   background-color: #eeebf3;
}
</style>
