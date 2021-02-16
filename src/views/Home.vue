<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <MovieList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import MovieList from "@/components/MovieList";
import Movie from "@/views/Movie";

export default {
  name: 'home',
  components: {
    Header,
    MovieList
  }
}
</script>
