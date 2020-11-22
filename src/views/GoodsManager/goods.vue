<template>
  <div >
      <p>goods</p>
      
      <div v-for="i of 5">
        <span>{{i}}</span>
      </div>
      <br/>

      <span v-for="j of 5">{{j}}</span>
  </div>
</template>

<script>
export default {
  name: "goods",

}
</script>

<style lang="less" scoped>

</style>
