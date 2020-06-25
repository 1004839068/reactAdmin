import React,{Component} from "react";
import { BrowserRouter as Router, Route, Link,Redirect } from "react-router-dom"; //路由 
import '../assets/css/App.css'; 
import '../assets/css/Login/login.css';
import { Form, Input, Button, Checkbox ,message} from 'antd'; 


class Login extends Component{
    constructor(props){
        super(props);
        this.state={
             flag:false
        }
    };

    //登陆成功执行
    onFinish = values => {
        // console.log('Success:', values);
        this.$axios.post(this.$url.login,{
            username:values.username,
            password:values.password
        }).then((res)=>{
            if(res.code==0){
                localStorage.setItem('admin_token',res.data);
                message.success(res.msg);
                this.setState({
                    flag:true
                })
                this.$axios.get(this.$url.getInfo+'/'+res.data).then((result)=>{
                    localStorage.setItem('admin_info',JSON.stringify(result.data));
                })
                
            }else{
                message.error(res.msg);
            } 
        })
      
       
    };
    
    //登陆失败执行
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    render(){

        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };

        const jzLayout = {
            wrapperCol: { offset:10,span:8},
         };

        const tailLayout = {
            wrapperCol: { offset: 10, span:8 },
          };
         
        if(this.state.flag){
            return (
                <Router>
                     <Redirect  to="/home"/>
                </Router>
            )
        }else{
            return(
                <div className="loginBox">
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: '用户名不能为空!' }]}
                        >
                            <Input allowClear="true"/>
                        </Form.Item>
    
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: '密码不能为空!'}]}
                        >
                            <Input.Password allowClear="true"/>
                        </Form.Item>
    
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                              登录
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className='footImg'></div>
                </div>
            )
        }
       
    }
}

export default Login;