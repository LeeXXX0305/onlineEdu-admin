<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <div style="text-align:center">
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      active: 1,
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '' // 课程大纲所属的课程id
    }
  },

  created() {
    console.log('chapter created')
    this.init() // 初始化课程大纲列表页面
  },

  methods: {

    // 初始化课程大纲列表页面
    init() {
      if (this.$route.query && this.$route.query.id) {
        this.courseId = this.$route.query.id
        console.log(this.courseId)
      }
    },

    previous() {
      console.log('previous')
      this.$router.push({ path: '/edu/course/info',query:{'id': this.courseId}})
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/edu/course/publish/' + this.courseId })
    }
  }
}
</script>
