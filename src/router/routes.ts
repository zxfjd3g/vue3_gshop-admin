import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）
 */
 export const staticRoutes: Array<RouteRecordRaw> = [
	{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: { 
        title: '首页', 
        icon: 'ele-HomeFilled', 
      }
    }]
  },
];


/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const allAsyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/acl',
    name: 'Acl',
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'ele-Setting',
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import("@/views/acl/user/index.vue"),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import("@/views/acl/role/index.vue"),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth',
        component: () => import("@/views/acl/role/roleAuth.vue"),
        meta: {
          title: '角色管理',
          hidden: true,
          activeMenu: 'role/list'
        },
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import("@/views/acl/permission/index.vue"),
        meta: {
          title: '菜单管理',
        },
      },
    ],
  },

  /* 商品管理 start */
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/category/list',
    meta: {
      title: '商品管理',
      icon: 'ele-ShoppingBag',
    },
    children: [
      {
        name: 'Category',
        path: 'category/list',
        component: () => import("@/views/product/category/index.vue"),
        meta: {
          title: '分类管理',
        },
      },
      {
        name: 'Trademark',
        path: 'trademark/list',
        component: () => import("@/views/product/trademark/index.vue"),
        meta: {
          title: '品牌管理',
        },
      },
      {
        name: 'Attr',
        path: '/product/attr/list',
        component: () => import("@/views/product/attr/index.vue"),
        meta: {
          title: '平台属性管理',
        },
      },
      {
        name: 'Spu',
        path: '/product/spu/list',
        component: () => import("@/views/product/spu/index.vue"),
        meta: {
          title: 'SPU管理',
        },
      },
      {
        name: 'Sku',
        path: '/product/sku/list',
        component: () => import("@/views/product/sku/index.vue"),
        meta: {
          title: 'SKU管理',
        },
      },
    ],
  },

    
];



/* 
匹配任意的路由 必须最后注册
*/
export const anyRoute: RouteRecordRaw = { 
  path: '/:pathMatch(.*)', 
  name: 'Any',
  redirect: '/404', 
  meta: {
    hidden: true 
  }
}