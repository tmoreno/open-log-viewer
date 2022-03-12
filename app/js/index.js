import 'typeface-roboto';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.css';
import '../css/vuetify-custom.css';
import '../css/ace-custom.css';
import en from '../js/locales/en.json';
import es from '../js/locales/es.json';
import it from '../js/locales/it.json';
import ptBR from '../js/locales/ptBR.json';

import Vue from 'vue';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';

import App from './App.vue';

Vue.use(Vuetify);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: navigator.language.replace('-',''),
  fallbackLocale: 'en',
  messages: {
    en, es, it, ptBR
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
