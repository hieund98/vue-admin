<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Category Name">
        <el-input v-model="form.name" style="width: auto" />
      </el-form-item>
      <el-form-item label="Category Slug">
        <el-input v-model="form.slug" style="width: auto" />
      </el-form-item>
      <el-form-item label="Is Active">
        <el-switch v-model="form.active" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  data() {
    return {
      form: {
        id: '',
        name: '',
        slug: '',
        active: true
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      axios
        .get('http://localhost:3000/categories/' + this.$route.query.id)
        .then(response => {
          this.form.name = response.data.name
          this.form.slug = response.data.slug
          this.form.id = response.data.id
        })
    },
    onSubmit() {
      if (this.$route.query.id) {
        axios
          .patch('http://localhost:3000/categories/' + this.$route.query.id, {
            name: this.form.name,
            slug: this.form.slug
          })
          .then(response => {
            if (response.status === 200 || response.status === 201) {
              this.$message({
                message: 'Update success!',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.data.message,
                type: 'error'
              })
            }
          }).catch(error => {
            this.$message({
              message: error.response ? error.response.data.message : error.message,
              type: 'error'
            })
          })
      } else {
        axios
          .post('http://localhost:3000/categories', {
            name: this.form.name,
            slug: this.form.slug
          })
          .then(response => {
            if (response.status === 200 || response.status === 201) {
              this.$message({
                message: 'Add category success!',
                type: 'success'
              })
              this.form.name = ''
              this.form.slug = ''
            } else {
              this.$message({
                message: response.data.message,
                type: 'error'
              })
            }
          }).catch(error => {
            this.$message({
              message: error.response ? error.response.data.message : error.message,
              type: 'error'
            })
          })
      }
    },
    onCancel() {
      router.push({ path: '/category/index' })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

