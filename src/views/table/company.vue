<template>
  <div class="app-container">
    <h2>{{tableName}}</h2>
    <el-table :data="tableData" v-loading.body="listLoading" element-loading-text="拼命加载中" border
              highlight-current-row>
      <tr v-for="col in cols">
        <el-table-column :prop="col.PROPERTY_NAME" :label="col.PROPERTY_FULLNAME"></el-table-column>
      </tr>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="showUpdate(scope.row)" type="text" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <el-dialog title="修改数据" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="detail" label-position="left">
          <el-form-item v-for="col in cols" :key="col.PROPERTY_FULLNAME" :label="col.PROPERTY_FULLNAME" :prop="col.PROPERTY_NAME">
            <el-input type="text" v-model="detail[`${col.PROPERTY_NAME}`]">
            </el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        objectId: 40,
        tableName: "公司",
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 20,//每页条数
          name: ''
        },
        dialogFormVisible: false,
        cols: [],
        tableData: [],
        detail: {}
      }
    },
    created() {
      this.getList();
      this.dataList();
    },
    methods: {
      getList() {
        //查询列表
//        if (!this.hasPerm('article:list')) {
//          return
//        }
        this.listLoading = true;
        this.api({
          url: "/table/property",
          method: "get",
          params: {
            objectId: 40
          }
        }).then(data => {
          this.listLoading = false;
          this.cols = data.list;
          this.totalCount = 10;
//          this.totalCount = data.totalCount;
        })
      },
      dataList() {
        this.listLoading = true;
        this.api({
          url: "/table/data",
          method: "get",
          params: {
            objectId: 40,
            pageNum: 0,//页码
            pageRow: 20,//每页条数
          }
        }).then(data => {
          this.listLoading = false;
          this.tableData = data.list;
          this.totalCount = 20;
//          this.totalCount = data.totalCount;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showUpdate(detail) {
        //显示新增对话框
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        console.log(detail)
        this.detail = detail;
      },
      updateData() {
        console.log(this.detail)

        this.getList();
        this.dialogFormVisible = false
        //修改数据
//        this.api({
//          url: "/table/updateDetail",
//          method: "post",
//          data: this.detail
//        }).then(() => {
//          this.getList();
//          this.dialogFormVisible = false
//        })
      },
    }
  }
</script>
