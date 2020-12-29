const prodPlugins = []
   //新建一个数组,用作发布时候用到的特定的插件
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')  
}


module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
}