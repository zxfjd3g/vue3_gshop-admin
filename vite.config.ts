import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv, type ConfigEnv } from 'vite';

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
  
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.ts', '.vue', '.js', '.jsx', '.tsx', ] // 类型： string[] 导入时想要省略的扩展名列表。
    },
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT as unknown as number,
      open: env.VITE_OPEN,
      proxy: {
        '/app-dev': {
          target: 'http://gmall-h5-api.atguigu.cn',
          // target: 'http://sph-h5-api.atguigu.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/app-dev/, ''),
        },
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
          // 给导入的路径最后加上 ; 
          additionalData: '@import "./src/styles/variables.scss";'
        }
      },
			postcss: {
				plugins: [
					{
						postcssPlugin: 'internal:charset-removal',
						AtRule: {
							charset: (atRule) => {
								if (atRule.name === 'charset') {
									atRule.remove();
								}
							},
						},
					},
				],
			},
		},
  }
})
