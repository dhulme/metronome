import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './App';

import('../node_modules/vuetify/dist/vuetify.min.css');

Vue.use(Vuetify);


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { 
    App
  },
});
