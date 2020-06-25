export default {
    login:'/admin/login/login',  //登录
    getInfo:"admin/Account/index/admin_token",   //获取管理员信息

    //问卷
    attr:"/admin/user/attr/admin_token/",  //获取科室二级联动 ,type 3  
    askStatus:"/admin/user/attrSet/admin_token/",   //状态列表  1进行 2无效
    askSub:"/admin/Questionnaire/index/admin_token/",  //获取问卷列表
    askPv:"/admin/Questionnaire/questionnaireData/admin_token/",  // pv数据
    askAdd:"/admin/Questionnaire/questionnaireAdd/admin_token/" ,  //添加
    adkDel:"/admin/Questionnaire/questionnaireDel/admin_token/",  //删除
     
    //用户
    useSub:"/admin/user/index/admin_token/",
    usePv:"/admin/user/getUserData/admin_token/"

}