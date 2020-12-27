let { ROOT } = require('./common')
let pluginJson = require('@rollup/plugin-json')
export default {
  input: `${ROOT}/snap-agent/index.js`,

  /**
   * @property {string} file 文件路径
   * @property {string} name 名称
   * @property {string} format 输出格式
   * @property {boolean} sourcemap 是否启用 sourcemap
   */
  output: {
    file: `${ROOT}/dist/snap-agent.js`,
    name: 'apiSnapAgent',
    // amd, cjs, esm, iife, umd
    // amd: 
    // cjs: node.js 环境
    // esm: 
    // iife: 浏览器环境
    // umd: 兼容环境, 同时支持 node.js 和浏览器
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    pluginJson(),
  ]
};