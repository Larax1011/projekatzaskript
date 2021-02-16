import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies : []
  },
  mutations: {
    set_movies: function (state,movies){
      state.movies = movies;
    },

    add_movie: function (state, movie){
      state.movies.push(movie);
    },

    remove_movie: function (state, id){
      for (let i = 0; i < state.movies.length; i++){
        if (state.movies[i].id == id){
          state.movies.splice(i,1);
          break;
        }

      }
    },

    update_movie: function (state, payload){
      for (let i = 0; i < state.movies.length; i++){
        if (state.movies[i].id == payload.id){
          state.movies[i].price = payload.prod.price;
          state.movies[i].name= payload.prod.name;
          break;
        }

      }
    }

  },
  actions: {
    load_movies: function ({ commit }) {
      fetch('http://localhost/api/movies', { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        console.log(jsonData);
        commit('set_movies', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_movie: function({ commit }, id) {
      fetch(`http://localhost/api/movie/${id}`, { method: 'delete' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('remove_movie', jsonData.id)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_movie: function({ commit }, movie) {
      fetch('http://localhost/api/movies', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: movie
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_movie', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_movie: function({ commit }, payload) {
      fetch(`http://localhost/api/movie/${payload.id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload.prod
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('update_movie', {id: payload.id, prod:jsonData});
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    }
  }



})
