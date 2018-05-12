<template>
  <div class="app-container">
    <h2>{{tableName}}</h2>
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate">修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" v-loading.body="listLoading" element-loading-text="拼命加载中" border
              highlight-current-row>
      <tr v-for="col in cols">
        <el-table-column :prop="col.prop" :label="col.label"></el-table-column>
      </tr>
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
      <el-form class="small-space" :model="tableData[0]" label-position="left" label-width="60px"
               style='width: 300px; margin-left:50px;'>
        <tr v-for="col in cols">
          <el-form-item :label="col.label">
            <el-input type="text" v-model="tableData[1].companyId">
            </el-input>
          </el-form-item>
        </tr>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateArticle">修 改</el-button>
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
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '修改数据'
        },
        tempArticle: {
          id: "",
          content: ""
        },
        cols: [
          {label: '公司', prop: 'companyId'},
          {label: '公司名称', prop: 'name'},
          {label: '公司地址', prop: 'address'},
          {label: 'slogan', prop: 'slogan',},
          {label: '管理', prop: 'manager',}
          ],
      tableData:[{
          companyId: '111',
          name: ' 小满装饰',
          address: '上海市杨浦区',
          slogan: '用心做装修'
        }, {
          companyId: '2222',
          name: '日晨装饰',
          address: '上海市虹口区',
          slogan: '装修，我们是专业的'
        }, {
          companyId: '3333',
          name: '小王装饰',
          address: '河南省许昌市',
          slogan: '专业装修专业装修专业装修专业装修专业装修'
        }]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        if (!this.hasPerm('article:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/article/listArticle",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
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
      showCreate() {
        //显示新增对话框
        this.tempArticle.content = "";
        this.dialogStatus = "create"
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempArticle.id = this.list[$index].id;
        this.tempArticle.content = this.list[$index].content;
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createArticle() {
        //保存新文章
        this.api({
          url: "/article/addArticle",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateArticle() {
        //修改文章
        this.api({
          url: "/article/updateArticle",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
    }
  }
</script>
