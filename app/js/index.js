import 'typeface-roboto';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.css';
import '../css/vuetify-custom.css';

import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './App.vue';

Vue.use(Vuetify);

new Vue({
  el: '#app',
  render: h => h(App)
});
