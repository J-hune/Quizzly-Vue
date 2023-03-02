import {createRouter, createWebHistory} from "vue-router";
import store from "@/store";

import HomeView from "../views/HomeView.vue";
import SignupView from "@/views/SignupView";
import SigninView from "@/views/SigninView";
import NewQcm from "@/views/Teacher/NewQcmView.vue";
import QuestionsList from "@/views/Teacher/QuestionsListView.vue";
import AddQuestion from "@/views/Teacher/AddQuestionView.vue";
import EditQuestion from "@/views/Teacher/EditQuestionView.vue";
import StudentsList from "@/views/Teacher/StudentsList.vue";
import DefaultPage from "@/views/DefaultPageView.vue";
import {checkUserLogged} from "@/functions/login";
import ProfileView from "@/views/Student/ProfileView.vue";
import AddSequenceView from "@/views/Teacher/AddSequenceView.vue";
import SequencesList from "@/views/Teacher/SequencesList.vue";
import EditSequenceView from "@/views/Teacher/EditSequenceView.vue";

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
               requiresAuth: true
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
            path: "/newQuestion",
            name: "newQuestion",
            component: AddQuestion,
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
            path: "/sequences",
            name: "sequences",
            component: SequencesList,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant"]
            }
         },
         {
            path: "/newSequence",
            name: "newSequence",
            component: AddSequenceView,
            meta: {
               requiresAuth: true,
               userType: ["Enseignant"]
            }
         },
         {
            path: "/sequence/:id/edit",
            name: "editSequence",
            component: EditSequenceView,
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
         },
         {
            path: "/profile",
            name: "profile",
            component: ProfileView,
            meta: {
               requiresAuth: true,
               userType: ["Etudiant"]
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
   if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
      const userData = await checkUserLogged();

      // On stocke les données de l'utilisateur
      if (userData.firstname) {
         store.commit("setUser", {
            id: userData.id,
            firstname: userData.firstname,
            surname: userData.surname,
            avatar: userData.avatar,
            type: userData.type
         });

         store.commit("setLoggedIn", true);
      } else {
         return next("/signin");
      }
   }

   // Si l'utilisateur n'a pas le bon type, on le redirige vers "/"
   if (to.meta.userType && !to.meta.userType.includes(store.getters.getUserType)) {
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
