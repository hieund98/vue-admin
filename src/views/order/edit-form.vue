<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="auto">
      <el-form-item label="Order Number">
        <el-input v-model="form.id" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="Customer Name">
        <el-input v-model="form.name" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="form.address" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="PhoneNumber">
        <el-input v-model="form.phoneNumber" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" style="width: auto" disabled />
      </el-form-item>
      <el-form-item label="Status">
        <el-input v-model="form.isDeleted" style="width: auto" disabled />
      </el-form-item>
    </el-form>
    <h2>Product Information</h2>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="STT" width="55">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Product Code" width="auto">
        <template slot-scope="scope">
          {{ scope.row.product }}
        </template>
      </el-table-column>
      <el-table-column label="Quantity" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sale Price" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="Import Price" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.importPrice }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="Created At" width="auto">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Updated At" width="auto">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Action" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-view" @click="toEdit(scope.row._id)">Detail</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="fireDelete(scope.row._id, scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      list: [],
      listLoading: true,
      imageUrl: '',
      form: {
        id: '',
        userID: '',
        isDeleted: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: ''
      }
    }
  },
  beforeCreate() {
  },
  created() {
    if (this.$route.query.id) {
      this.fetchData()
    }
  },
  mounted() {
  },
  methods: {
    fetchData() {
      this.listLoading = true
      axios
        .get('http://localhost:3000/orders/' + this.$route.query.id, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
        .then(response => {
          this.form.id = response.data[0].orderCode
          this.form.isDeleted = response.data[0].isDeleted ? 'Canceled' : 'Created'
          this.list = response.data[0].order_details

          axios
            .get('http://localhost:3000/users/' + response.data[0].user, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
            .then(response => {
              this.form.name = response.data.name
              this.form.address = response.data.address
              this.form.email = response.data.email
              this.form.phoneNumber = response.data.phoneNumber

              for (const [key, value] of Object.entries(this.list)) {
                axios
                  .get('http://localhost:3000/products/' + value.product, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
                  .then(response => {
                    if (response.data.images !== undefined && response.data.images.length > 0) {
                      // response.data.images[0] = response.data.images[0].split('\\')[2]
                      // this.list[key].images[0] = '/img/product-img/' + response.data.images[0]
                    }

                    this.list[key].product = response.data.name
                    this.list[key].importPrice = response.data.importPrice
                    this.list[key].salePrice = response.data.salePrice

                    if (this.list[key].images === undefined) this.list[key].images = ['/img/product-img/product-1.jpg']

                    this.listLoading = false
                  })
              }
            })
        })
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
