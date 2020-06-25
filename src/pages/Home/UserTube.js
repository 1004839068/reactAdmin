import React,{Component} from "react";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom"; //路由 
import ExportJsonExcel from "js-export-excel"
import { 
    PageHeader,
    Row,
    Col, 
    Form,
    Input, 
    Button,
    Select,
    DatePicker,
    Divider,
    Alert,
    Table,
    Modal,message
} from 'antd';
import { DownloadOutlined ,PlusOutlined,DeleteOutlined} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
const { Option } = Select;
const { confirm } = Modal;

class UserTube extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kinds:[],  //科室
            professionals:[],  //职称
            uv:[],
            columns:[
                {
                    title: '用户id',
                    align: 'center' ,
                    dataIndex: 'id'
                  },
                  {
                    title: '微信昵称',
                    align: 'center' ,
                    dataIndex: 'nickname',
                  },
                  {
                    title: '姓名',
                    align: 'center' ,
                    dataIndex: 'name',
                  },
                  {
                    title: '性别',
                    align: 'center' ,
                    dataIndex: 'gender',
                  },
                  {
                    title: '医院',
                    align: 'center' ,
                    dataIndex: 'company',
                  },
                  {
                    title: '科室',
                    align: 'center' ,
                    dataIndex: 'department',
                  },
                  {
                    title: '职称',
                    align: 'center' ,
                    dataIndex: 'professional_title',
                  },
                  {
                    title: '认证状态',
                    align: 'center' ,
                    dataIndex: 'audit_status',
                  },
                  {
                    title: '完成问卷数',
                    align: 'center' ,
                    dataIndex: 'is_questionnaire',
                  },
                  {
                    title: '获得积分',
                    align: 'center' ,
                    dataIndex: 'points',
                  },
                  {
                    title: '剩余积分',
                    align: 'center' ,
                    dataIndex: 'now_points',
                  },
                  {
                    title: '认证时间',
                    align: 'center' ,
                    dataIndex: 'create_time',
                  },
                  {
                    title: '用户状态',
                    align: 'center' ,
                    dataIndex: 'status',
                  },
                  {
                    title: '操作',
                    align: 'center' ,
                    dataIndex: 'do',
                    render: (text,rows) => (
                        <span>
                            <Button type="primary" size="small" className="mr">查看</Button>
                            <Button type="danger" size="small" onClick={this.showDeleteConfirm.bind(this,text,rows)}>删除</Button>
                        </span> 
                    )
                  },
            ],
            listdata:[
                {
                    id: 17,
                    open_id: "on0gu5TL3pLO1XyDJBIBZUBW4S6E",
                    phone: "",
                    nickname: "樱花开了几轉",
                    avatar: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK1jPq1aNfRMicoicYjib8KdguobPF85p2NtOKFTDNc1YAg5wKcC9N3Me8JrvgSribXsL6PjYOPlN1RWg/132",
                    gender: 1,
                    name: null,
                    company: null,
                    department: null,
                    professional_title: null,
                    status: 1,
                    audit_status: 1,
                    reject: null,
                    certificate_type: 1,
                    positive_img: "",
                    back_img: "",
                    points: 500,
                    now_points: 0,
                    is_questionnaire: 2,
                    last_login_time: 0,
                    register_status: 3,
                    create_time: 1591091940,
                    update_time: 1591091940,
                 }
                
            ],
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,   

            //分页
            totals:"3",  //total
            pageSize:"2",   //每页条数
            pageNum:"1",   //当前页数
            total:"3",

            //请求条件
            seach:{
                name:' ',
                department:' ',
                professional_title:' ',
                status:' ',
                start:' ',
                end:' '
            }
            

        }
    };

    //生命周期,初始化
    componentDidMount(){
        let token=localStorage.getItem('admin_token');
        //获取二级联动
        console.log(this.$url.attr+token)
        this.$axios.get(this.$url.attr+token+'?type=3').then((res)=>{
            console.log(res);
            if(res.code==0){
                this.setState({
                    kinds:res.data
                })
            }
        })

        this.$axios.get(this.$url.attr+token+'?type=2').then((res)=>{
            if(res.code==0){
                this.setState({
                    professionals:res.data
                })
            }
        })

        this.getData(this.state.seach,token);
        this.tableData(this.state.seach,token,1,10);
    };
    
    //删除弹层
    showDeleteConfirm = (a,b,c)=> {
        let token=localStorage.getItem('admin_token');
        let that=this;
        confirm({
            title: '温馨提示',
            content: '是否删除这条数据',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                that.$axios.post(that.$url.adkDel+token,{
                    id:b.id
                }).then((res)=>{
                    if(res.code==0){
                        message.success('删除成功');
                        that.tableData(that.state.seach,token,1,10);
                    }
                })
            },
            onCancel() {
                message.error('您已已取消删除');
            }
        });
    }
  
    //导出
    handleExport = () => {
        const { ReqDetailList } = this.props;    // 网络请求命名空间
        const{columns} = this.state;      // 需要放在state里边,Table，Columns
        const option = {};
    
        option.fileName = 'excel';
        option.datas = [
            {
                sheetData: ReqDetailList.data.map(item => {
                    const result = {};
                    columns.forEach(c => {
                        result[c.dataIndex] = item[c.dataIndex];
                    });
                    return result;
                }),
                sheetName: 'ExcelName',     // Excel文件名称
                sheetFilter: columns.map(item => item.dataIndex),
                sheetHeader: columns.map(item => item.title),
                columnWidths: columns.map(() => 10),
            },
        ];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    };
       
  //up
   getData(values,sendToken){
       if(values.user!=undefined){
        this.$axios.get(this.$url.usePv+sendToken+'?name='+values.user+'&department='+values.department
        +'&professional_title='+values.professional_title+'&status='+values.status+'&start='+values.start
        +'&end='+values.end).then((res)=>{
            // console.log(res);
                this.setState({
                    uv:[{
                        title:'用户数量',
                        num:res.data.loginNum
                    },
                    {
                        title:'注册人数',
                        num:res.data.registerNum
                    },
                    {
                        title:'认证人数',
                        num:res.data.auditNum
                    },
                    {
                        title:'完成问卷人数',
                        num:res.data.questionnaireNum
                    },
                    {
                        title:'平均完成问卷数',
                        num:res.data.questionnaireAverageLogNum
                    },
                    {
                        title:'平均获得积分数',
                        num:res.data.pointsAverageNum
                    } 
                    ]
                })
        });
       }else{
        this.$axios.get(this.$url.usePv+sendToken,{
            name:"",
            department:"",
            professional_title:"",
            status:"",
            start:"",
            end:"" 
        }).then((res)=>{
            console.log(res);
                this.setState({
                    uv:[{
                        title:'用户数量',
                        num:res.data.loginNum
                    },
                    {
                        title:'注册人数',
                        num:res.data.registerNum
                    },
                    {
                        title:'认证人数',
                        num:res.data.auditNum
                    },
                    {
                        title:'完成问卷人数',
                        num:res.data.questionnaireNum
                    },
                    {
                        title:'平均完成问卷数',
                        num:res.data.userQuestionnaireAverageNum
                    },
                    {
                        title:'平均获得积分数',
                        num:res.data.pointsAverageNum
                    } 
                    ]
                })
        });
       }
   
   }

   //表格数据
   tableData(datad,token,page,pageSize){
        this.$axios.get(this.$url.useSub+token,{
            page:page,
            pageSize:pageSize,
            name:datad.user,
            department:datad.department,
            professional_title:datad.professional_title,
            status:datad.status,
            start:datad.start,
            end:datad.end
        }).then((res)=>{
            this.setState({
                listdata:res.data.data
            })
        });
   }

   //提交
    onFinish = values => {
        console.log('Received values of form: ', values);
        let sendToken=localStorage.getItem('admin_token');
        //表格数据
        this.tableData(values,sendToken,1,10);
        //uv数据
        this.getData(values,sendToken);
    };

    //重置
    onReset = () => {
      console.log("11111")
    };
    
    //下拉选中
    phange=(value)=> {
        console.log(`selected ${value}`);
    }

    khange=(value)=> {
        console.log(`selected ${value}`);
    }

    handleChange=(val)=>{
        console.log(`selected ${val}`);
    }

    //选中时间
    onChange=(date, dateString)=> {
        console.log(date, dateString);
    }
   
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
      };
    
    //表格选中的数据
     onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    //表格点中行
    onRowSelect = (record, index)=>{
        return {
            onClick:(e)=>{
                console.log(record)   //一行的数据
            }
        }
    };

    //changePage
    changePage=(pag)=>{
        console.log(pag)
    }

    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                {/* 标题 */}
                <PageHeader
                    className="site-page-header"
                    title="用户列表"
                />
                <Form
                    name="advanced_search"
                    className="ant-advanced-search-form"
                    ref={this.formRef} 
                    onFinish={this.onFinish}
                    style={{paddingBottom:"4px"}}
                    
                >
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item
                                name='user'
                                label='用户ID/姓名'
                                rules={[
                                    {
                                        required: false,
                                        message: '请输入用户ID或姓名',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入用户ID或姓名" size="middle" />
                            </Form.Item>
                        </Col>


                        <Col span={6}>
                            <Form.Item
                                name='department'
                                label='科室'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                <Select  placeholder='请选择科室' onChange={this.kChange}>
                                    {
                                        this.state.kinds.map((val,index)=>{
                                            return  (<Option value={val.name} key={index}>{val.name}</Option>)
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name='professional_title'
                                label='职称'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                 <Select placeholder='请选择职称'  onChange={this.phange}>
                                    {
                                        this.state.professionals.map((val,index)=>{
                                            return  (<Option value={val.name} key={index}>{val.name}</Option>)
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                   

                    <Row gutter={24}>
                        
                    <Col span={6}>
                            <Form.Item
                                name='status'
                                label='认证状态'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                <Select placeholder='选择认证状态'  onChange={this.handleChange}>
                                    <Option value="">不限</Option>
                                    <Option value="1">封禁</Option>
                                    <Option value="2">有效</Option>
                                   
                                </Select>
                            </Form.Item>
                        </Col>
                         <Col span={6}>
                            <Form.Item 
                                name='start'
                                label='注册时间'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                
                                <DatePicker onChange={this.onChange} locale={locale} style={{width:'90%'}}  />
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{position:'relative',left:'-29px'}}>
                            <Form.Item
                                name='end'
                                label='至'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                <DatePicker onChange={this.onChange} locale={locale}   style={{width:'90%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={6}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{marginRight:"20px"}}>
                                    查询
                                </Button>
                                <Button htmlType="button" onClick={this.onReset}>
                                重置
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                
              {/* 类型 */}
              <Row gutter={[16, 16]} className="types">
                 {
                     this.state.uv.map((val,ind)=>{
                         return  <Col span={4}>
                                    <div className='title'>{val.title}</div>
                                     <div className='con'>{val.num}</div>
                                 </Col>
                     })
               
                  }
               </Row>

               <Divider />

               <Row>
                 <Col span={24} className="tip">
                     <Alert
                        message="查询结果总计:100万"
                        type="info"
                        showIcon
                    />
                 </Col>
               </Row>

                <Row className="dothn">
                    <Button  size="middle" className="mar" icon={<DownloadOutlined />} >导出</Button>
                </Row>

               <Row className='datas'>
                    <Table
                        rowSelection={rowSelection} 
                        columns={this.state.columns}
                        dataSource={this.state.listdata}
                        style={{width:'100%'}}
                        onRow={this.onRowSelect}
                        showSizeChanger
                        showQuickJumper
                        pagination= {{ 
                            position: ['bottomCenter'] ,
                            // showTotal: () => `共${this.state.totals}条`,
                            pageSize: this.state.pageSize,
                            current: this.state.pageNum,
                            // total: this.state.total,
                            // onChange: (current) => this.changePage(current)
                        }}
                    />
               </Row>
            </div>
        )
    }
}

export default UserTube;