<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Product Name">
        <el-input v-model="form.name" style="width: auto" />
      </el-form-item>
      <el-form-item label="Product Code">
        <el-input v-model="form.productCode" style="width: auto" />
      </el-form-item>
      <el-form-item label="Import price">
        <el-input v-model="form.importPrice" style="width: auto" />
      </el-form-item>
      <el-form-item label="Sale price">
        <el-input v-model="form.salePrice" style="width: auto" />
      </el-form-item>
      <el-form-item label="Quantity">
        <el-input v-model="form.actualQuantity" style="width: auto" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description" style="width: auto" />
      </el-form-item>
      <el-form-item label="Category">
        <el-select v-model="form.category" placeholder="please select a category">
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
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
      categories: [],
      imageUrl: '',
      form: {
        id: '',
        name: '',
        productCode: '',
        importPrice: 0,
        salePrice: 0,
        actualQuantity: 0,
        description: '',
        category: ''
      }
    }
  },
  created() {
    axios
      .get('http://localhost:3000/categories')
      .then(response => {
        this.categories = response.data
      })

    if (this.$route.query.id) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      axios
        .get('http://localhost:3000/products/' + this.$route.query.id)
        .then(response => {
          this.form.name = response.data.name
          this.form.productCode = response.data.productCode
          this.form.category = response.data.category
          this.form.actualQuantity = response.data.actualQuantity
          this.form.description = response.data.description
          this.form.salePrice = response.data.salePrice
          this.form.importPrice = response.data.importPrice
          this.form.active = true
        })
    },
    onSubmit() {
      if (this.$route.query.id) {
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('category', this.form.category)
        formData.append('description', this.form.description)
        formData.append('productCode', this.form.productCode)
        formData.append('importPrice', this.form.importPrice)
        formData.append('salePrice', this.form.salePrice)
        formData.append('actualQuantity', this.form.actualQuantity)

        axios
          .patch('http://localhost:3000/products/' + this.$route.query.id, formData)
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
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('category', this.form.category)
        formData.append('description', this.form.description)
        formData.append('productCode', this.form.productCode)
        formData.append('importPrice', this.form.importPrice)
        formData.append('salePrice', this.form.salePrice)
        formData.append('actualQuantity', this.form.actualQuantity)

        axios.post('http://localhost:3000/products', formData)
          .then(response => {
            if (response.status === 200 || response.status === 201) {
              this.$message({
                message: 'Add Product success!',
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
      router.push({ path: '/product/index' })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
