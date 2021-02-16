<template>
  <b-container fluid>
    <b-form>
      <b-row class="mt-2">
        <b-col sm="2" offset="2">
          <b-input v-model="newName" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Name"></b-input>
        </b-col>
        <b-col sm="5">
          <b-form-textarea v-model="newPrice" placeholder="Price"></b-form-textarea>
        </b-col>
        <b-col sm="1">
          <b-button variant="primary" size="lg" @click="addNew">Save</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "EditMovie",
  props: {
    name: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      newName: '',
      newPrice: 0
    }
  },
  mounted: function () {
    this.newName = this.name;
    this.newPrice= this.price;
  },
  methods: {
    ...mapActions(['new_movie', 'change_movie']),

    addNew: function() {
      const prod = JSON.stringify({name: this.newName, price: this.newPrice});

      if (!this.$route.params.id)
        this.new_movie(prod);
      else
        this.change_movie({id: this.$route.params.id, prod: prod});

      this.newName = '';
      this.newPrice = 0;
    }
  }
}
</script>

<style scoped>

</style>