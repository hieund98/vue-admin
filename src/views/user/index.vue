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
      <el-table-column label="Email" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Active" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isActive | statusFilter" effect="dark">{{ scope.row.isActive ? 'Active' : 'Disabled' }}</el-tag>
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
      <el-table-column align="center" label="Action" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" style="margin-bottom: 5px;" @click="toEdit(scope.row._id)">Edit</el-button>
          <el-button v-if="scope.row.isActive" type="danger" icon="el-icon-turn-off" @click="fireDelete(scope.row._id, scope.$index)">Deactive</el-button>
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
        false: 'info',
        true: 'gray'
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
      router.push({ path: '/user/edit', query: { id: _id }})
    },
    fireDelete(_id, index) {
      if (confirm('Do you really want to deactivate this account?')) {
        axios.delete('http://localhost:3000/users/' + _id, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
          .then(resp => {
            // this.list.splice(index, 1)
            this.$message({
              message: 'Remove User success!',
              type: 'success'
            })
            this.fetchData()
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
      router.push({ path: '/user/add', query: { }})
    },
    fetchData() {
      this.listLoading = true
      axios
        .get('http://localhost:3000/users?pageSize=4&page=' + this.currentPage + '&search=' + this.form.name, { headers: { Authorization: 'Bearer ' + process.env.VUE_APP_BEARER_TOKEN }})
        .then(response => {
          this.list = response.data.data
          this.currentPage = response.data.page
          this.totalPage = response.data.totalPage

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
