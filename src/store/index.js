import { createStore } from "vuex";
import image from "../assets/img/f2.png";

const store = createStore({
   state() {
      return {
         user: {
            id: null,
            firstname: null,
            lastname: null,
            type: null
         },
         isLoggedIn: false
      };
   },
   mutations: {
      setUser(state, { id, firstname, surname, avatar, type }) {
         state.user.id = id;
         state.user.firstname = firstname;
         state.user.surname = surname;
         state.user.avatar = avatar;
         state.user.type = type;
      },
      setLoggedIn(state, value) {
         state.isLoggedIn = value;
      },
      setUserAvatar(state, { avatar }) {
         state.user.avatar = avatar;
      }
   },
   getters: {
      getUserId(state) {
         return state.user.id;
      },
      getUserName(state) {
         return state.user.firstname + " " + state.user.surname;
      },
      getUserAvatar(state) {
         return state.user.avatar || image;
      },
      getUserType(state) {
         return state.user.type;
      },
      isLoggedIn(state) {
         return state.isLoggedIn;
      }
   },
   actions: {
      updateUserAvatar({ commit }, avatar) {
         commit('setUserAvatar', { avatar })
      },
   },
});

export default store;