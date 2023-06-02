<template>
  <div>
    <b-collapse id="displayOptions" class="d-md-block">
      <!-- <div class="d-block d-md-inline-block pt-1">
        <div class="iq-search-bar">
          <b-form action="#" class="searchbox">
              <b-input id="search" placeholder="Ingrese datos para buscar..." @input="(val) => searchChange(val)" />
              <a class="search-link" href="#"><i class="ri-search-line"></i></a>
          </b-form>
        </div>
      </div> -->
      <div class="float-md-right pt-1 pr-4">
        <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
        <b-dropdown
          id="ddown2"
          right
          size="sm"
          variant="outline-dark"
          class="d-inline-block"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template v-slot:button-content>
            {{ perPage }}
          </template>
          <b-dropdown-item v-for="(size,index) in pageSizes"
            v-bind:key="index"
            @click="changePageSize(size)">
            {{ size }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </b-collapse>
  </div>
</template>
<script>
// import { defineComponent } from '@vue/composition-api'p;-[]
export default {
  name: 'DatatableHeading',
  props: [
    'changePageSize',
    'searchChange',
    'from',
    'to',
    'total',
    'perPage'
  ],
  data () {
    return {
      pageSizes: [4, 8, 12]
    }
  }
}
</script>
