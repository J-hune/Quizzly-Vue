import { createStore } from 'vuex'

const index = createStore({
   state() {
      return {
         user: {
            id: null,
            firstname: null,
            lastname: null,
            type: null
         },
         isLoggedIn: false
      }
   },
   mutations: {
      setUser(state, { id, firstname, surname, type }) {
         state.user.id = id
         state.user.firstname = firstname
         state.user.surname = surname
         state.user.type = type
      },
      setLoggedIn(state, value) {
         state.isLoggedIn = value
      }
   },
   getters: {
      getUserId(state) {
         return state.user.id
      },
      getUserName(state) {
         return state.user.firstname + ' ' + state.user.surname
      },
      getUserType(state) {
         return state.user.type
      },
      isLoggedIn(state) {
         return state.isLoggedIn
      }
   }
})

export default index