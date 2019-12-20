<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <!-- 课程信息表单-->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <!-- 一级分类 -->
        <el-select v-model="courseInfo.subjectParentId" placeholder="请选择" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!-- 课程封面 TODO -->

    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  title: '',
  subjectId: '',
  subjectParentId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: '',
  price: 0
}

export default {
  components: { Tinymce },

  data() {
    return {
      active: 0,
      courseInfo: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectList: [],//一级分类列表
      subSubjectList: [],//二级分类列表
      teacherList:[],
    }
  },

  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },

  created() {
    console.log('info created')
    this.init()
  },

  methods: {

    init() {
      if (this.$route.query && this.$route.query.id) {
        const id = this.$route.query.id
        console.log(id)
        this.getCourseInfoById(id)
      } else {
        this.courseInfo = { ...defaultForm }
        this.initSubjectList();
      }

      this.initTeacherList();
    },

    initSubjectList(){
      subject.getSubjectList().then(response => {
        console.log(response);
        if(response.code === 200){
          this.subjectList = response.data.data
        }else{
          this.$message({
            message: "获取课程分类失败",
            type: 'error',
          });
        }
      });
    },
    initTeacherList(){
      teacher.getList().then(response => {
        if(response.code === 200){
          this.teacherList = response.data.data
        }else{
          this.$message({
            message: "获取讲师列表失败",
            type: 'error',
          });
        }
      });
    },
    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    getCourseInfoById(id){
      course.getCourseInfoById(id).then(response => {
        if(response.code === 200){
          this.courseInfo = response.data.data;
          subject.getSubjectList().then(response => {
            if(response.code === 200){
              this.subjectList = response.data.data;
              for(let i = 0;i < this.subjectList.length; i++){
                if(this.subjectList[i].id === this.courseInfo.subjectParentId){
                  this.subSubjectList = this.subjectList[i].children;
                }
              }
            }else{
              this.$message({
                message: "获取课程分类失败",
                type: 'error',
              });
            }
          });
        }else{
          this.$message({
            message: "获取课程信息失败",
            type: 'error',
          });
        }
      });
    },
    // 保存
    saveData() {
      course.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给下一个then
      }).then(response => {
        this.$router.push({ path: '/edu/course/chapter', query:{'id': response.data.courseId} });
      })
    },

    updateData() {
      this.$router.push({ path: '/edu/course/chapter/1' })
    },

    subjectLevelOneChanged(value){
      console.log(value);
      for(let i = 0;i < this.subjectList.length; i++){
        if(this.subjectList[i].id === value){
          this.subSubjectList = this.subjectList[i].children;
          this.courseInfo.subjectId = '';
        }
      }
    },
  }
}
</script>
<style scoped>
.tinymce-container{
  position: relative;
  line-height:normal;
}
</style>