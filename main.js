import Vue from 'vue';
import App from './App';
import { http } from '@/utils/luch-request/index.js'; // 全局挂载引入，配置相关在该index.js文件里修改
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue';
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
import mixLoading from '@/components/mix-loading/mix-loading.vue';
// 分享组件
import shareBox from '@/components/share.vue';
import uniShare from '@/components/uni-share/uni-share.vue';
import tipBox from '@/components/tip.vue';
import eulaBox from '@/components/eula.vue';
import errorPage from '@/pages/404.vue';
// import addFocus from '@/components/add-focus.nvue';
// import uLink from '@/components/uLink.vue';
import store from './store';
Vue.prototype.$store = store

Vue.prototype.$http = http;
Vue.config.productionTip = false;

Vue.component('mescroll-body', MescrollBody);
Vue.component('mescroll-uni', MescrollUni);
Vue.component('mix-loading', mixLoading);
Vue.component('uni-share', uniShare);
Vue.component('share-box', shareBox);
Vue.component('tip-box', tipBox);
Vue.component('eula-box', eulaBox);
Vue.component('error-page', errorPage);
// Vue.component('add-focus', addFocus);
// Vue.component('uLink', uLink);

App.mpType = 'app';

const app = new Vue({
	store,
	...App
})
app.$mount();
