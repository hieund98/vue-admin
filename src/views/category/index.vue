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
      <el-table-column align="center" label="STT" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Name" width="auto" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Slug" width="auto" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.slug }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created At" width="auto" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <!--      <el-table-column class-name="status-col" label="Status" width="110" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" prop="created_at" label="Update At" width="auto">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Updated By" width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Action" width="auto">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="toEdit(scope.row._id)">Edit</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="fireDelete(scope.row._id, scope.$index)"/>
        </template>
      </el-table-column>
    </el-table>
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
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toEdit(_id) {
      console.log(_id)
      router.push({ path: '/category/edit', query: { id: _id }})
    },
    fireDelete(_id, index) {
      if (confirm('Do you really want to delete this category?')) {
        axios.delete('http://localhost:3000/categories/' + _id)
          .then(resp => {
            this.list.splice(index, 1)
            this.$message({
              message: 'Remove category success!',
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
      router.push({ path: '/category/add', query: { }})
    },
    fetchData() {
      this.listLoading = true
      axios
        .get('http://localhost:3000/categories?search=' + this.form.name)
        .then(response => {
          this.list = response.data
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
