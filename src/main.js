import Vue from 'vue';

import App from './App';
import Vuetify from 'vuetify/es5/components/Vuetify';

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
