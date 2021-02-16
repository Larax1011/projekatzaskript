<template>
  <div>
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <div v-if="edit">
            <EditMovie :name="movie.name" :movie="movie.movie"/>
          </div>
          <div v-else>
            <ShowMovie v-if="moviess.length" :movie="movie"/>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cm="2" style="margin-top: 10px">
          <b-button variant="primary" size="lg" @click="toggleEdit" v-html="edit ? 'Cancel' : 'Edit'"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EditMovie from "@/components/EditMovie";
import Header from "@/components/Header";
import ShowMovie from "@/components/ShowMovie";
import { mapState, mapActions } from 'vuex';

export default {
  name: "Movie",
  components: {
    Header,
    EditMovie,
    ShowMovie
  },
  data() {
    return {
      edit: false
    }
  },
  computed: {
    ...mapState(['movies']),

    movie: function () {
      for (let i = 0; i < this.movies.length; i++)
        if (this.movies[i].id === parseInt(this.$route.params.id))
          return this.movies[i];
    }
  },
  methods: {
    ...mapActions(['load_movies']),

    toggleEdit: function () {
      this.edit = !this.edit
    }
  }
}
</script>

<style scoped>

</style>