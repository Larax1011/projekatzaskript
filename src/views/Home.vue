<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col cm="6" >
          <ProductList/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import Product from "@/views/Product";

export default {
  name: 'home',
  components: {
    Header,
    ProductList
  }
}
</script>
