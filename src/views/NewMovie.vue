<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <EditMovie/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import EditMovie from "@/components/EditMovie";
import Header from "@/components/Header";

export default {
  name: "NewMovie",
  components: {
    Header,
    EditMovie
  }
}
</script>

<style scoped>

</style>