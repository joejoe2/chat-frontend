<template>
  <nav aria-label="PageNavigation">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <a
          v-if="current > 0"
          class="page-link"
          v-on:click="updateCurrentPage(current - 1)"
          >Previous</a
        >
      </li>
      <template v-for="pageNum in totalPages" v-bind:key="pageNum">
        <li v-if="pageNum - 1 == current" class="page-item active">
          <a class="page-link">{{ pageNum }}</a>
        </li>
        <li v-else class="page-item">
          <a
            class="page-link"
            v-on:click="updateCurrentPage(pageNum - 1)"
            >{{ pageNum }}</a
          >
        </li>
      </template>
      <li class="page-item">
        <a
          v-if="current < totalPages - 1"
          class="page-link"
          v-on:click="updateCurrentPage(current + 1)"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
    name: "PageNavigation",
    props: {
        totalPages: {
            required: true,
            type: Number,
        },
        currentPage: {
            required: true,
            type: Number,
        },
    },
    data(){
        return {
            current: this.currentPage,
        };
    },
    methods: {
        updateCurrentPage(pageNum){
          this.current = pageNum;
          this.$emit('onPageChanged', pageNum);
        },
    }
};
</script>

<style>
</style>