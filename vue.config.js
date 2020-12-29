module.exports = {  //向外面暴露一下配置来设置参数
   chainWebpack: config=>{
    //生产打包配置
    config.when(process.env.NODE_ENV==='production', config=>{
      config.entry('app').clear().add('./src/main-prod.js')
      
      //配置externals加载外部CND资源,不需要打包的就对其进行配置
      //这配置的对象，在打包期间如果发先有下列配置的包，那就不对进行打包
      //而是会在window全局查找配置键值对中值所对应的名字的全局对象
      config.set('externals',{
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        'vue-quill-editor':'VueQuillEditor'
      })
    })

    //开发打包配置
    config.when(process.env.NODE_ENV==='development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
    })
  },
};
