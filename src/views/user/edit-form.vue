<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="auto">
      <el-form-item label="Fullname">
        <el-input v-model="form.name" style="width: auto" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" style="width: auto" />
      </el-form-item>
      <el-form-item v-if="!this.$route.query.id" label="Password">
        <el-input type="password" v-model="form.password" style="width: auto" />
      </el-form-item>
      <el-form-item label="Age">
        <el-input v-model="form.age" style="width: auto" />
      </el-form-item>
      <el-form-item label="Phone Number">
        <el-input v-model="form.phoneNumber" style="width: auto" />
      </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="form.address" style="width: auto" />
      </el-form-item>
      <el-form-item label="Role">
        <el-select v-model="form.role" placeholder="please select a role">
          <el-option label="admin" value="admin" />
          <el-option label="user" value="user" />
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
        email: '',
        age: 0,
        address: '',
        password: '',
        phoneNumber: '',
        role: '',
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
        .get('http://localhost:3000/users/' + this.$route.query.id, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
        .then(response => {
          this.form.name = response.data.name
          this.form.email = response.data.email
          this.form.role = response.data.role
          this.form.address = response.data.address ?? ''
          this.form.age = response.data.age ?? ''
          this.form.phoneNumber = response.data.phoneNumber ?? ''
          this.form.active = response.data.isActive
        })
    },
    onSubmit() {
      if (this.$route.query.id) {
        axios
          .patch('http://localhost:3000/users/' + this.$route.query.id, {
            name: this.form.name,
            email: this.form.email,
            role: this.form.role,
            age: this.form.age,
            phoneNumber: this.form.phoneNumber,
            address: this.form.address,
            isActive: this.form.active
          }, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
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
          .post('http://localhost:3000/users/register', {
            name: this.form.name,
            password: this.form.password,
            email: this.form.email,
            role: this.form.role,
            age: this.form.age,
            phoneNumber: this.form.phoneNumber,
            address: this.form.address
          })
          .then(response => {
            if (response.status === 200 || response.status === 201) {
              this.$message({
                message: 'Add User success!',
                type: 'success'
              })

              this.form.name = ''
              this.form.email = ''
              this.form.password = ''
              this.form.role = ''
              this.form.address = ''
              this.form.age = ''
              this.form.phoneNumber = ''
              this.form.active = true
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
      router.push({ path: '/user/index' })
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
