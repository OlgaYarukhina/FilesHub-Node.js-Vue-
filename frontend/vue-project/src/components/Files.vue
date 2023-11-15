<template>
  <RightSideItem>
    <div v-for="file in files" v-if="files.length > 0" >
      <div v-if="!isfilesLoading">{{ file.title }}
        <button v-on:click="deleteFile">Delete</button>
      </div>
      <div v-else> Laoding ...</div>
    </div>
    <div v-else> No files have been  upoaded yet</div>
  </RightSideItem>
</template>

<script>
import RightSideItem from './RightSideItem.vue';
export default {
  components: {
    RightSideItem,
  },
  data() {
    return {
      files: [],
      files1: [
        { id: 1, title: "Firs" },
        { id: 2, title: "Second" }
      ],
      isfilesLoading: false,
    }
  },
  methods: {
    deleteFile() {

    },
    async getFilesList() {
  try {
    this.isfilesLoading = true;
    const response = await fetch('http://localhost:8080/files?_limit=20');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    this.files = data;
  } catch (error) {
    console.log(error);
  } finally {
    this.isfilesLoading = false;
  }
}

  },
  mounted(){
      this.getFilesList();
    }
}
</script>