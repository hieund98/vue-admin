<template>
  <div class="app-container">
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
      <el-table-column label="Name" width="410">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Slug" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.slug }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created At" width="220" align="center">
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
      <el-table-column align="center" prop="created_at" label="Update At" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Updated By" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Action" width="200">
        <template slot-scope="scope">
          <el-button type="primary" v-on:click="toEdit(scope.row._id)">Edit</el-button>
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
    fetchData() {
      this.listLoading = true
      axios
        .get('http://localhost:3000/categories')
        .then(response => {
          this.list = response.data.data
          console.log(this.list)
          this.listLoading = false
        })

      // getList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    }
  }
}
</script>
