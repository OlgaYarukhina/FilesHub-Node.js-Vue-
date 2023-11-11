<template>
  <RightSideItem>
    <form>
      <input v-bind:value="title" @input="title = $event.target.value" class="input" type="text"
        placeholder="Set file name" name="fileName" required>
      <br />
      <img v-if="imagePreview" :src="imagePreview" class="preview" />
      <br />
      <br />
      <label for="file-upload" class="btn">
        Choose file
      </label>
      <input ref="fileInput" id="file-upload" type="file" @change="handleFileUpload" required style="display: none;">
      <button class="btn" v-if="title && file" @click.prevent="uploadFile">
        Upload
      </button>
      <button class="btn" v-if="title && file" @click.prevent="deleteFile" type="button">
        Cancel
      </button>
    </form>
  </RightSideItem>
</template>



<script>
import RightSideItem from './RightSideItem.vue';
export default {
  components: {
    RightSideItem
  },
  data() {
    return {
      title: '',
      file: null,
    }
  },
  methods: {
    handleFileUpload() {
      this.file = event.target.files[0];
      this.imagePreview = URL.createObjectURL(this.file);
    },
    uploadFile() {
      if (this.file && this.title) {
        const formData = new FormData();
        formData.append('myFile', this.file); 
        formData.append('fileName', this.title); 
        
        for (let [key, value] of formData.entries()) {
    console.log(key, value);
}
        fetch('http://localhost:8080/file', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok.');
            }
            return response.json();
          })
          .then(data => {
            console.log('Successfully uploaded:', data);
          })
          .catch((error) => {
            console.error('Error while uploading file:', error);
          });
      }
    },

    deleteFile() {
      // Перевіряємо, чи існує URL прев'ю, і якщо так, то видаляємо його
      if (this.imagePreview) {
        URL.revokeObjectURL(this.imagePreview);
        this.imagePreview = null; // Скидуємо URL прев'ю
      }
      this.file = null; // Скидуємо об'єкт файлу
      this.$refs.fileInput.value = ''; // Очищуємо вхідний елемент за допомогою refs
    },
  }
}
</script>

<style setup>
.input {
  width: 400px;
  margin: 20px 0px;
  padding: 10px;
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 5px;
}

.btn {
  width: 130px;
  margin-right: 20px;
  padding: 10px;
  border: none;
  background-color: hsla(160, 100%, 37%, 1);
  border-radius: 5px;
  color: rgb(9, 9, 9);
}

.btn:hover {
  width: 130px;
  padding: 10px;
  border: none;
  background-color: rgb(2, 128, 86);
  border-radius: 5px;
  color: antiquewhite;
}

.preview {
  max-width: 400px;
  height: auto;
  /* Щоб зберегти пропорції зображення */
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>