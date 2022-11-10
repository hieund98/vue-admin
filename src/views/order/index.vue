<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="220px">
      <el-form-item label="Search By Name">
        <el-input v-model="form.name" style="width: auto" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">Search</el-button>
<!--        <el-button type="success" icon="el-icon-plus" @click="fireAdd">Add</el-button>-->
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
      <el-table-column align="center" label="Order Code" width="auto">
        <template slot-scope="scope">
          {{ scope.row.orderCode }}
        </template>
      </el-table-column>
      <el-table-column label="Customer Name" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user[0].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Customer Email" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.user[0].email }}
        </template>
      </el-table-column>
      <el-table-column label="Deliver Address" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.user[0].address }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Customer Phone Number" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.user[0].phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Active" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDeleted | statusFilter" effect="dark">{{ scope.row.isDeleted ? 'Canceled' : 'Created' }}</el-tag>
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
        false: 'secondary',
        true: 'info',
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
      console.log(12211212)
      router.push({ path: '/order/edit', query: { id: _id }})
    },
    fireDelete(_id, index) {
      if (confirm('Do you really want to delete this product?')) {
        axios.delete('http://localhost:3000/orders/' + _id, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
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
        .get('http://localhost:3000/orders/list?search=' + this.form.name, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
        .then(response => {
          this.list = response.data
          console.log(this.list[0].user[0].phoneNumber)
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
