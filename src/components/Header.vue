<template>
  <div>
    <b-jumbotron header="Store Warehouse Board" :lead="'Num movies: ' + movies.length">
    </b-jumbotron>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "Header",
  computed: {
    ...mapState(['movies'])
  }
}
</script>

<style scoped>

</style>