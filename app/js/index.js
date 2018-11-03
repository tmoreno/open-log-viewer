import 'typeface-roboto';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.css';
import 'clusterize.js/clusterize.css'
import '../css/vuetify-custom.css';
import en from '../js/locales/en.json';
import es from '../js/locales/es.json';

import Vue from 'vue';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';

import App from './App.vue';

Vue.use(Vuetify);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en, es
  }
});

new Vue({
  el: '#app',
  i18n,
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
