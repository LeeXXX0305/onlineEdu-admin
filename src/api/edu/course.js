import request from '@/utils/request'
const api_name = '/admin/edu/course'

export default{
  saveCourseInfo(courseInfo){
    return request({
      url: `${api_name}/saveCourse`,
      method: 'post',
      data: courseInfo
    })
  },
  getCourseInfoById(id){
    return request({
      url: `${api_name}/courseInfo`,
      method: 'get',
      params: {'id':id}
    })
  }
}