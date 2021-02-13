import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products : []
  },
  mutations: {
    set_products: function (state,products){
      state.products = products;
    },

    add_product: function (state, product){
      state.products.push(product);
    },

    remove_product: function (state, id){
      for (let i = 0; i < state.products.length; i++){
        if (state.products[i].id == id){
          state.products.splice(i,1);
          break;
        }

      }
    },

    update_product: function (state, payload){
      for (let i = 0; i < state.products.length; i++){
        if (state.products[i].id == payload.id){
          state.products[i].price = payload.prod.price;
          state.products[i].name= payload.prod.name;
          break;
        }

      }
    }

  },
  actions: {
    load_products: function ({ commit }) {
      fetch('http://localhost/api/products', { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        console.log(jsonData);
        commit('set_products', jsonData)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    delete_product: function({ commit }, id) {
      fetch(`http://localhost/api/product/${id}`, { method: 'delete' }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json()
      }).then((jsonData) => {
        commit('remove_product', jsonData.id)
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    new_product: function({ commit }, product) {
      fetch('http://localhost/api/products', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: product
      }).then((response) => {
        if (!response.ok)
          throw response;

        return response.json();
      }).then((jsonData) => {
        commit('add_product', jsonData);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },

    change_product: function({ commit }, payload) {
      fetch(`http://localhost/api/product/${payload.id}`, {
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
        commit('update_product', {id: payload.id, prod:jsonData});
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
