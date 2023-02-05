import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignupView from "@/views/SignupView";
import SigninView from "@/views/SigninView";
import ListeLabels from "@/views/LabelsList.vue";
import NewQcm from "@/views/NewQcm.vue";
import ListeQuestions from "@/views/QuestionsList.vue";
import AddQuestion from "@/views/AddQuestion.vue";
import EditQuestion from "@/views/EditQuestion.vue";
import StudentsList from "@/views/StudentsList.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "",
        name: "Labels",
        component: ListeLabels
      },
      {
        path: "/label/:label",
        name: "label",
        component: ListeQuestions
      },
      {
        path: "/question/:id/edit",
        name: "editQuestion",
        component: EditQuestion
      },
      {
        path: "/newQuestion",
        name: "newQuestion",
        component: AddQuestion
      },
      {
        path: "/newQCM",
        name: "newQCM",
        component: NewQcm
      },
      {
        path: "/students",
        name: "students",
        component: StudentsList
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

export default router;
