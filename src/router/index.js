import { createRouter, createWebHistory } from "vue-router";
import index from "@/store";

import HomeView from "../views/HomeView.vue";
import SignupView from "@/views/SignupView";
import SigninView from "@/views/SigninView";
import NewQcm from "@/views/Teacher/NewQcmView.vue";
import QuestionsList from "@/views/Teacher/QuestionsListView.vue";
import AddQuestion from "@/views/Teacher/AddQuestionView.vue";
import EditQuestion from "@/views/Teacher/EditQuestionView.vue";
import StudentsList from "@/views/Teacher/StudentsList.vue";
import DefaultPage from "@/views/DefaultPageView.vue";
import { checkUserLogged } from "@/functions/login";

const routes = [
   {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
         {
            path: "",
            name: "DefaultPage",
            component: DefaultPage,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant", "Etudiant"]
            }
         },
         {
            path: "/label/:label",
            name: "label",
            component: QuestionsList,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant"]
            }
         },
         {
            path: "/question/:id/edit",
            name: "editQuestion",
            component: EditQuestion,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant"]
            }
         },
         {
            path: "/newQuestion",
            name: "newQuestion",
            component: AddQuestion,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant"]
            }
         },
         {
            path: "/newQCM",
            name: "newQCM",
            component: NewQcm,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant"]
            }
         },
         {
            path: "/students",
            name: "students",
            component: StudentsList,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant"]
            }
         }
      ]
   },
   {
      path: "/signup",
      name: "signup",
      component: SignupView
   },
   {
      path: "/signin",
      name: "signin ",
      component: SigninView
   }
];

const router = createRouter({
   history: createWebHistory(process.env.BASE_URL),
   routes
});


router.beforeEach(async (to, from, next) => {

   // Si l'utilisateur doit être auth mais ne l'est pas, il est redirigé
   if (to.meta.requiresAuth && !index.getters.isLoggedIn) {
      const userData = await checkUserLogged();

      // On stocke les données de l'utilisateur
      if (userData.firstname) {
         index.commit("setUser", {
            id: userData.id,
            firstname: userData.firstname,
            surname: userData.surname,
            type: userData.type
         });

         index.commit("setLoggedIn", true);
      } else {
         return next("/signin");
      }
   }

   // Si l'utilisateur n'a pas le bon type, on le redirige vers "/"
   if (to.meta.userType && !to.meta.userType.includes(index.getters.getUserType)) {
      // Afficher un message d'erreur si l'utilisateur n'a pas les autorisations nécessaires
      alert("Vous n'avez pas les autorisations nécessaires pour accéder à cette page.");

      return next("/");
   }

   // Sinon, il peut continuer
   else {
      next();
   }
});

export default router;
