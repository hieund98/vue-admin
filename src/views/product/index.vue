<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="220px">
      <el-form-item label="Search By Name">
        <el-input v-model="form.name" style="width: auto" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">Search</el-button>
        <el-button type="success" icon="el-icon-plus" @click="fireAdd">Add</el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column align="center" label="Name" width="auto">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Code" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Quantity" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.actualQuantity }}
        </template>
      </el-table-column>
      <el-table-column label="Sale Price" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.salePrice }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Import Price" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.importPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" width="auto">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="Image" width="auto">
        <template slot-scope="scope">
          <el-image fit="fill" :src="scope.row.images[0]" alt="Image" />
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
          <el-button type="primary" icon="el-icon-edit" @click="toEdit(scope.row._id)">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="fireDelete(scope.row._id, scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="center"
      background
      layout="prev, pager, next"
      :page-count="totalPage"
      :current-page.sync="currentPage"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: 'success',
        true: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      form: {
        name: ''
      },
      list: null,
      listLoading: true,
      totalPage: 1,
      currentPage: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toEdit(_id) {
      console.log(_id)
      router.push({ path: '/product/edit', query: { id: _id }})
    },
    fireDelete(_id, index) {
      if (confirm('Do you really want to delete this product?')) {
        axios.delete('http://localhost:3000/products/' + _id)
          .then(resp => {
            this.list.splice(index, 1)
            this.$message({
              message: 'Remove Product success!',
              type: 'success'
            })
          })
          .catch(error => {
            this.$message({
              message: error.response ? error.response.data.message : error.message,
              type: 'error'
            })
          })
      }
    },
    fireAdd() {
      router.push({ path: '/product/add', query: { }})
    },
    fetchData() {
      this.listLoading = true
      axios
        .get('http://localhost:3000/products?pageSize=4&page=' + this.currentPage + '&search=' + this.form.name)
        .then(response => {
          this.list = response.data.data
          this.currentPage = response.data.page
          this.totalPage = 3
          console.log(this.list)
          for (const [key, value] of Object.entries(this.list)) {
            if (value.images[0] !== undefined) {
              value.images[0] = value.images[0].split('\\')[2]
              this.list[key].images[0] = '/img/product-img/' + value.images[0]
            }
          }
          console.log(this.list)
          this.listLoading = false
        }).catch(error => {
          this.$message({
            message: error.response ? error.response.data.message : error.message,
            type: 'error'
          })
        })

      // getList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    }
  }
}
</script>
