import Login from "../pages/Login.js"
import Home from "../pages/Home.js"
import AskTube from "../pages/Home/AskTube.js"
import UserTube from "../pages/Home/UserTube.js"
import Integral from "../pages/Home/Integral.js"

let routes=[
   {
       path:"/",
       component:Login,
       exact:true
   },

   {
       path:"/home",
       component:Home
        
   },

   {
        path:"/askTube",
        component:AskTube
    },
    {
        path:"/userTube",
        component:UserTube
    },
   {
        path:"/integral",
        component:Integral
    }   //表单
];

export default routes;