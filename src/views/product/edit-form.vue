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
      <el-form-item label="Product Image">
        <el-upload class="upload-box" drag action="" :auto-upload="false" :on-change="handleImport" :on-preview="handlePreview" :limit="1" :on-exceed="handleExceed">
          <i class="el-icon-upload" />
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
          <div slot="tip" class="el-upload__tip">Single JSON file with size less than 500kb</div>
        </el-upload>
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
      uploadFile: null,
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
        this.categories = response.data.data
      })

    if (this.$route.query.id) {
      this.fetchData()
    }
  },
  methods: {
    handleImport(file) {
      this.uploadFile = file
      const reader = new FileReader()
      console.log(this.uploadFile)
      reader.readAsText(this.uploadFile.raw)
      reader.onload = async(e) => {
        try {
          this.fileContent = JSON.parse(e.target.result)
        } catch (err) {
          console.log(`Load JSON file error: ${err.message}`)
        }
      }
    },
    handlePreview() {
      const myWindow = window.open()
      myWindow.document.write(JSON.stringify(this.fileContent))
      myWindow.document.close()
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 1, you selected ${files.length + fileList.length} totally, please first remove the unwanted file`)
    },
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
        formData.append('images', this.uploadFile)
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
        this.uploadFile = event.target.files[0]
        formData.append('images', this.uploadFile)
        axios.post('http://localhost:3000/products', formData, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
          .then(response => {
            if (response.status === 200 || response.status === 201) {
              this.$message({
                message: 'Add Product success!',
                type: 'success'
              })
              this.form.name = ''
              this.form.productCode = ''
              this.form.salePrice = ''
              this.form.description = ''
              this.form.importPrice = ''
              this.form.actualQuantity = ''
              this.form.category = ''
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
