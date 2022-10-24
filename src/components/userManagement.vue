<template>
    <div>
        <el-container>
        <el-header style="font-size: 12px;line-height:60px;border-bottom: 1px solid #ccc;display:flex ">
          <div style="flex:1;font-size: 25px">
            <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>
          </div>
          <el-dropdown style="cursor:pointer">
            <!--        <i class="el-icon-setting" style="margin-right: 15px"></i>-->
            <span>Tom</span> <i class="el-icon-arrow-down" style="margin-left:5px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>View</el-dropdown-item>
              <el-dropdown-item>Add</el-dropdown-item>
              <el-dropdown-item>Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </el-header>

        <el-main>
          <!--      增删改查 <i>的class 里使用不同风格的图标 type element里封装好的样式 -->
          <div style="padding: 10px 0;float: left">
            <el-button type="primary" @click="sendPopulation">insert
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
            <el-button type="danger">Delete
              <i class="el-icon-remove-outline"></i>
            </el-button>
            <el-button type="primary">input
              <i class="el-icon-download"></i>
            </el-button>
            <el-button type="primary">output
              <i class="el-icon-upload2"></i>
            </el-button>
          </div>
          <!--      搜索框-->
          <div  style="padding: 10px 0; float: right">
            <el-input  style="width:150px;float: left"></el-input>
            <el-button type="primary"  style="float: left">Primary</el-button>
          </div>

        
          <!--      表格主题-->
          <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" >
<!--            table li的prop和数据表的表头 相同-->
            <el-table-column type="index" align="left" width="90"  label="编号" > </el-table-column>
            <el-table-column prop="UserName" label="UserName" width="140"></el-table-column>
            <el-table-column prop="Password" label="Password" width="120" v-model="password">
            <!-- <el-input  width="120" v-model="scope.row.password"></el-input> -->
            </el-table-column>
            <el-table-column prop="Type" label="Type"></el-table-column>
            <el-table-column >              
              <template slot-scope="scope">
                <el-button type="success" @click="editUser(scope.row)">editor<i class="el-icon-edit-outline"></i></el-button>
                <el-button type="danger" @click="deleteUser(scope.row)">delete<i class="el-icon-remove-outline"></i></el-button>
              </template>
              
            </el-table-column>
          </el-table>




          <!--      分页效果栏 Pagination-->
          <div  style="padding: 15px ;align=right">
            <div class="block">
<!--              @尺寸变化和当前页面 点击触发函数 pageNum pageSize total 与fetch查询到的数据库数据进行绑定-->
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pageNum"
                  :page-sizes="[5,10,15,20]"
                  :page-size="pageSize"
                  :hide-on-single-page="false"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
              </el-pagination>
            </div>
          </div>

        </el-main>

      </el-container>
    </div>
</template>


<script>

export default {
  name: 'userManagement',
  data() {
    return {
      tableData:[],//列表数据
      total:10,//总计
      pageNum:1,
      pageSize:10,
      // tableData: Array(10).fill(item),
      collapseBtnClass:'el-icon-s-fold',//折叠图标的类型根据点击事件 collapse发生改变
      isCollapsed:false, //false展开true折叠
      sideWidth:200,//侧导航栏宽度
      LogoTextShow:true,//文本是否显示
      password:"",
      loading:true
    }
  },
  
  
  created(){
  //  请求分页查询数据
    this.load()
  },



  methods:{//写一些界面常见方法，用于请求和传递数据
    collapse(){ //点击收缩按钮触发 菜单栏收缩
      this.isCollapsed=!this.isCollapsed;
      if(this.isCollapsed){
        this.sideWidth=64
        this.collapseBtnClass='el-icon-s-unfold'
        this.LogoTextShow=false
      }else{
        this.sideWidth=200
        this.collapseBtnClass='el-icon-s-fold'
        this.LogoTextShow=true

      }
    },

    editUser(row){
      // console.log(this.Map)

    },

    sendPopulation(){
      this.$bus.$emit("sendPopulation",this.total)
      console.log("success")
    },


    load(){
      var that = this;
      this.loading=true
      this.axios.get('/usersapi/'+this.pageNum+"/"+this.pageSize)
      .then(function (res) {
          that.tableData=res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
       this.axios.get('/usersapi/dataList')
      .then(function (res) {    
          that.total=res.data.length;
          that.loading=false;
        })     
    },


    handleSizeChange(pageSize){
      console.log("pageSize:"+pageSize)
      this.pageSize=pageSize 
      this.load()
    },


    handleCurrentChange(pageNum){
      console.log("pageNum:"+pageNum)
      this.pageNum=pageNum
      this.load()
      
    },

    deleteUser(row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
            this.axios.delete('/usersapi'+row.UserName)
            .then((res)=>{console.log(res)})
            .then(this.load())
            .then(window.location.reload())
            this.$message({
                type: 'success',
                message: '删除成功!'
          });
        })
        .catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
          });          
        });

    }

  }

}
</script>