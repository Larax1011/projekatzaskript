<template>

  <b-container fluid>
    <b-row>
      <b-col sm="2">
        <label for="Name">Name:</label>
      </b-col>
      <b-col sm="10">
        <p id="name" style="text-align: left">{{ movie.name }}</p>
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col sm="2">
        <label for="Price">Price:</label>
      </b-col>
      <b-col sm="10">
        <p id="price" style="text-align: left">{{ movie.price }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
    export default {
      name: "ShowMovie",
      props: {
        movie: Object
      }
    }
</script>