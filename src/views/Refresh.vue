<template>
  <div></div>
</template>

<script>
export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  beforeRouteEnter(to, from, next){
    next(vm => {
      vm.$router.replace(from.path)
    })
  }
}
</script>

<style scoped>

</style>