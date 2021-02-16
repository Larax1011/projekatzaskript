<template>
  <div>
    <b-table
        hover v-if="movies.length"
        sticky-header="800px"
        :items="movies"
        :fields="fields"
        head-variant="light"
        @row-clicked="editMovie">
      <template v-slot:cell(action)="row">
        <b-button variant="danger" @click="delete_movie(row.movie.id)">Delete</b-button>
      </template>
    </b-table>
    <h1 v-else>Empty stock</h1>
  </div>
</template>

<script>
import router from "@/router";
import { mapState, mapActions } from 'vuex';

export default {
  name: "MovieList",
  computed: {
    ...mapState(['movies'])
  },
  data() {
    return {
      fields: [
        { key: 'PRICE' },
        { key: 'NAME' },
        { key: 'action' }
      ]
    }
  },
  methods: {
    ...mapActions(['delete_movie']),

    editMovie: function (item, index, event) {
      router.push({path: `/movie/${item.id}`})
    }
  }
}
</script>

<style>
tr:hover td{
  background: lightgreen;
}
</style>