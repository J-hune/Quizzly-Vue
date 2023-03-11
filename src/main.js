// Importation des modules et de leurs dépendances
import { createApp } from "vue";
import VueCookies from "vue-cookies";
import Toast from "vue-toastification";
import { vfmPlugin } from "vue-final-modal";
import VueFeather from "vue-feather";
import VueApexCharts from "vue3-apexcharts";
import "vue-toastification/dist/index.css";

// Importation des directives et store Vuex
import clickOutside from "@/Methods/click-outside";
import store from "@/store";

import App from "./App.vue";
import router from "./router";

// Importation du css
import "./assets/tailwind.css";
import "./assets/markdown.css";
import "./assets/font.css";
import "highlight.js/styles/default.css";

// Options pour la bibliothèque Toast
const options = {
   position: "top-right",
   timeout: 5000,
   closeOnClick: true,
   pauseOnFocusLoss: false,
   pauseOnHover: true,
   draggable: true,
   draggablePercent: 0.6,
   showCloseButtonOnHover: false,
   hideProgressBar: false,
   closeButton: "button",
   icon: true,
   rtl: false
};

// On crée l'application Vue
const app = createApp(App);

// On ajoute le composant Vue Feather
app.component(VueFeather.name, VueFeather);

// On utilise les bibliothèques et fichiers importés
app.use(router);
app.use(VueCookies);
app.use(Toast, options);
app.use(store);
app.use(VueApexCharts);

// On ajoute le plugin Vue Final Modal
app.use(vfmPlugin({
   key: "$vfm",
   componentName: "VueFinalModal",
   dynamicContainerName: "ModalsContainer"
}));

// On ajoute la directive click-outside
app.directive("click-outside", clickOutside);

// On monte l'application sur l'élément avec l'id app
app.mount("#app");