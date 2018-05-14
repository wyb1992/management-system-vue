<template>
  <div class="app-container">
    <h2>{{tableName}}</h2>
    <el-table :data="tableData" v-loading.body="listLoading" element-loading-text="拼命加载中" border
              highlight-current-row>
      <tr v-for="col in cols">
        <el-table-column :prop="col.PROPERTY_NAME" :label="col.PROPERTY_FULLNAME"></el-table-column>
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableName: "装修公司",
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
          create: '创建文章'
        },
        tempArticle: {
          id: "",
          content: ""
        },
        cols: [],
        tableData:[]
//        cols: [
//          {label: '公司ID', prop: 'companyId'},
//          {label: '公司名称', prop: 'name'},
//          {label: '公司地址', prop: 'address'},
//          {label: 'slogan', prop: 'slogan'}
//          ],
//      tableData:[{
//          companyId: '111',
//          name: ' 小满装饰',
//          address: '上海市杨浦区',
//          slogan: '用心做装修'
//        }, {
//          companyId: '2222',
//          name: '日晨装饰',
//          address: '上海市虹口区',
//          slogan: '装修，我们是专业的'
//        }, {
//          companyId: '3333',
//          name: '小王装饰',
//          address: '河南省许昌市',
//          slogan: '专业装修专业装修专业装修专业装修专业装修'
//        }]
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
