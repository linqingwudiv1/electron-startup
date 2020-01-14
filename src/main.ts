//#region import 区域

import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import GameSettingDialog from '@/views/Singleton/GameSettingDialog/install';  
import 'element-ui/lib/theme-chalk/index.css';
import 'animate.css';
import '@/assets/css/common.styl';
import 'default-passive-events';

//#endregion

Vue.use(ElementUI);
Vue.config.productionTip = false;

//注入全局唯一组件到整个Vue App中...
Vue.use(GameSettingDialog);

new Vue({
  router : router ,
  store  : store  ,
  render : (h) => h(App)
}).$mount('#app');