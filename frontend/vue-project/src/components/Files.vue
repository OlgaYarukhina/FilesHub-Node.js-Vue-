<template>
  <RightSideItem>
    <div v-for="file in files">
        <div>{{file.title}}
        <button v-on:click="uploadFile">Delete </button>
    </div>
    </div>
  </RightSideItem>
</template>

<script>
import RightSideItem from './RightSideItem.vue';
export default {
  components: {
    RightSideItem,
  },
  props: {
files: {
    type: Array,
    required: true
}
  },
    data () {
        return {
            post: {
                id: null,
                title: '',
                file: null
            },
            files: [
                {id: 1, title: "Firs"},
                {id: 2, title: "Second"}
            ]
        }
    },
  methods: {
    uploadFile (){
      
    }
  }
}
</script>