import React,{Component} from "react";
import {BrowserRouter as Router,Route,Link} from "react-router-dom";
import '../assets/css/App.css'; 
import '../assets/css/Home/home.css';
import { Provider} from "react-redux";  //在下面的render函数中路由包裹在Provider里面
import store from "../Store";  //引入redux数据管理，
import routes from "../routes/router.js";
import { Layout, Menu,Avatar,Dropdown,Breadcrumb  } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  FormOutlined ,
  BellOutlined ,
  UserOutlined 
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <Link to='/'>退出</Link>
    </Menu.Item>
  </Menu>
);
class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            collapsed: false,
            info:{}
           
        }
    };

    //生命周期
    componentDidMount () {
        this.setState(() => ({
          info:JSON.parse(localStorage.getItem('admin_info')) || []
        }))
    }
    
   
    //展开收起
    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    };

    //退出登录
    gout=()=>{
    
    };

  
    render(){
    
        return(
         <Provider store={store}>
          <Router>
              <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                  <div className="logo" />
                  <Menu theme="dark" 
                        mode="inline" 
                        defaultSelectedKeys={['0']}  
                        defaultOpenKeys={['01']}>
                    <SubMenu key="01" icon={<ReadOutlined />} title="问卷管理">
                      <Menu.Item key="0">
                        <Link to="/askTube">
                          <span>问卷列表</span>
                        </Link>
                      </Menu.Item>
                    </SubMenu>

                    <SubMenu key="02" icon={<FormOutlined />} title="用户管理">
                      <Menu.Item key="1">
                        <Link to="/userTube">
                          <span>用户列表</span>
                        </Link>
                      </Menu.Item>
                    </SubMenu>

                    <SubMenu key="03" icon={<FormOutlined />} title="积分管理">
                      <Menu.Item key="2">
                        <Link to="/integral">
                          <span>积分列表</span>
                        </Link>
                      </Menu.Item>
                    </SubMenu>

                  </Menu>
                </Sider>
  
                <Layout>
                  <Header className="site-layout-background" style={{ padding: 0 }}>
                      {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: this.toggle,
                      })}
                      <div className="headR">
                          <BellOutlined  style={{fontSize:'18px',top:'3px',position:'relative'}}/>
                          <Avatar size="small" icon={<UserOutlined />} className="rl"/>
                          <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link gray" onClick={e => e.preventDefault()}>
                              {this.state.info.nickname}
                            </a>
                          </Dropdown>
                      </div>
                      
                  </Header>
                  <Breadcrumb style={{ padding: '16px 16px 0',boxSize:'border-box'}}>
                      <Breadcrumb.Item>问卷管理</Breadcrumb.Item>
                      <Breadcrumb.Item>问卷列表</Breadcrumb.Item>
                   </Breadcrumb>
                  <Content
                    style={{
                      margin: '24px 16px',
                      padding: 24,
                      background: '#fff',
                      minHeight: 280,
                    }}
                  >
                    
                    {
                      routes.map((route, key) => {
                        if (route.exact) {
                          return <Route key={key} exact path={route.path}
                            render={props => (
                              <route.component {...props} routes={route.routes} />
                            )}
                          />
                        } else {
                          return <Route key={key} path={route.path}
                            render={props => (
                              <route.component {...props} routes={route.routes} />
                            )}
                          />
  
                        }
                      })
                    }
                  </Content>
                </Layout>
              </Layout>
       
          </Router>
         </Provider>
        )
    }
}

export default Home;