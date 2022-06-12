import { createRouter, createWebHistory } from 'vue-router';
import 'nprogress/nprogress.css';
import { staticRoutes } from '@/router/routes';

const router = createRouter({
	history: createWebHistory(),
	routes: staticRoutes,
  scrollBehavior() {
    return { top: 0, left: 0}
  },
})

// 导出路由
export default router;