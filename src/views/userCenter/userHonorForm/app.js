import Vue from 'vue';
import App from './app.vue';
import 'muse-ui/lib/styles/base.less';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/global.less';
import 'assets/fonts/iconfont.css';

if (process.env === 'production') {
  window.apiready = function () {
    new Vue({
      el: '#app',
      render: h => h(App)
    });
  };
} else {
  new Vue({
    el: '#app',
    render: h => h(App)
  });
}