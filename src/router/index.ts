import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/home/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
];

const router = new VueRouter({
  routes: routes
});

export default router;
