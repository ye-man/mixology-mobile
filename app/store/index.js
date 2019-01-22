import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import firebase from 'nativescript-plugin-firebase'

Vue.use(Vuex);

const state = {
  recipes: [],
  activeRecipe: null
}

const mutations = {
  setRecipes: (state, recipes) => {
    state.recipes = recipes
    console.log(JSON.stringify(state.recipes))
  }
}

const actions = {

  fetchRecipe({commit}, payload) {

    var onQueryEvent = function (result) {
      if (result.error) {
        console.log(result.error)
      } else {
        const obj = result.value;
        const recipes = Object.keys(obj || {}).map(key => ({
          id: key,
          name: obj[key].name,
          ingredient1: "\u2022 "+obj[key].measurement1+' '+obj[key].ingredient1,
          ingredient2: "\u2022 "+obj[key].measurement2+' '+obj[key].ingredient2,
          ingredient3: "\u2022 "+obj[key].measurement3+' '+obj[key].ingredient3,
          ingredient4: "\u2022 "+obj[key].measurement4+' '+obj[key].ingredient4,
          ingredient5: "\u2022 "+obj[key].measurement5+' '+obj[key].ingredient5,
          ingredient6: "\u2022 "+obj[key].measurement6+' '+obj[key].ingredient6,
          instructions: obj[key].instructions,
        }));
        commit('setRecipes', recipes);
      }
    };

    firebase.query(
        onQueryEvent,
        "/",
        {
            singleEvent: true,
            orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: 'ingredient1'
            },
            range: {
                type: firebase.QueryRangeType.EQUAL_TO,
                value: payload
            },
            limit: {
                type: firebase.QueryLimitType.LAST,
                value: 5
            }
        }
    );
  }
}

const storeConf = {
  state,
  mutations,
  actions
}

export default new Vuex.Store(storeConf)
