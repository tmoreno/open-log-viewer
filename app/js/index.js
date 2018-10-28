import 'typeface-roboto';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.css';
import 'clusterize.js/clusterize.css'
import '../css/vuetify-custom.css';

import Vue from 'vue';
import Vuetify from 'vuetify';

import App from './App.vue';

Vue.use(Vuetify);

new Vue({
  el: '#app',
  render: h => h(App)
});

document.addEventListener('dragover', function(event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function(event) {
  event.preventDefault();
  return false;
}, false);
