<template>
  <table v-if="files.length > 0">
    <tbody>
      <tr v-for="file in files" :key="file.id">
        <td>
          <div v-if="editingStates[file.id]?.editing">
            <input v-model="editingStates[file.id].newName" @keyup.enter="submitRename(file)" type="text">
            <button @click="submitRename(file)">✓</button>
            <button @click="cancelRename(file)">✖</button>
          </div>
          <div v-else>
            {{ file.title }}
          </div>
        </td>
        <td>{{ file.extname }}</td>
        <td><button class="btn-vw" v-on:click="viewFile(file.fileUrl)">View</button></td>
        <td><button class="btn-dl" v-on:click="downloadFile(file.title, file.id, file.extname)">Download</button></td>
        <td><button class="btn-rn" v-on:click="startRename(file)">Rename</button></td>
        <td><button class="btn-dlt" v-on:click="deleteFile(file)">Delete</button></td>
      </tr>
    </tbody>
  </table>
  <div v-else>No files have been uploaded yet</div>
  <div v-if="isfilesLoading">Loading ...</div>
</template>


<script>
import Swal from 'sweetalert2';
import RightSideItem from './RightSideItem.vue';
export default {
  components: {
    RightSideItem,
  },
  data() {
    return {
      files: [],
      isfilesLoading: false,
      editingStates: {},                  // об'єкт для збереження стану редагування
    }
  },
  methods: {
    async getFilesList() {
      try {
        this.isfilesLoading = true;
        const response = await fetch('http://localhost:8080/files?_limit=20');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.files = data;
        console.log(this.files)
      } catch (error) {
        console.log(error);
      } finally {
        this.isfilesLoading = false;
      }
    },
    viewFile(url) {
      console.log(url)
      window.open(url, '_blank');
    },
    async downloadFile(title, id, extname) {
      try {
        const filename = `${title}:${id}.${extname}`;
        const url = `http://localhost:8080/download/${filename}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download error:', error);
      }
    },
    async deleteFile(file) {
      try {
        const filename = `${file.title}:${file.id}.${file.extname}`;
        const url = `http://localhost:8080/file/${filename}`;
        const response = await fetch(url, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        await this.getFilesList();
      } catch (error) {
        console.error('Delete error:', error);
      }
    },
    startRename(file) {
      // режим редагування для конкретного файлу
      this.editingStates[file.id] = {                               //$set for vue2
        editing: true,
        newName: file.title
      };
    },

    async submitRename(file) {
      if (this.editingStates[file.id].editing) {
        const updatedName = this.editingStates[file.id].newName;
        if (!/^[^:.\/]*$/.test(updatedName) || updatedName.length > 30) {
          Swal.fire({
            text: 'Invalid file name. .:/ is not allowed and length should be less than 30 characters.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
        }
        try {
          const filename = `${file.title}:${file.id}.${file.extname}`;
          const response = await fetch(`http://localhost:8080/file/${filename}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newName: updatedName })
          });
          await this.getFilesList();
        } catch (error) {
          console.error('Rename error:', error);
        } finally {
          this.editingStates[file.id].editing = false;
        }
      }
    },
    cancelRename(file) {
      this.editingStates[file.id].editing = false;
    },
  },
  mounted() {
    this.getFilesList();
  }
}
</script>


<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 0.5px solid #747272;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.btn-vw {
  background-color: rgb(95, 157, 220);
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-vw:hover {
  background-color: rgb(5, 59, 112);
}

.btn-dl {
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-dl:hover {
  background-color: rgb(2, 128, 86);
}

.btn-rn {
  background-color: #b39210;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-rn:hover {
  background-color: #7a6304;
}

.btn-dlt {
  background-color: #510223;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-dlt:hover {
  background-color: #730512;
}
</style>
