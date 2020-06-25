import React, { Component,useState } from "react";
import { Link } from "react-router-dom"; //路由 
import '../../assets/css/App.css';
import '../../assets/css/Home/askTube.css';
	
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
    Cascader,
    Modal,message ,
    
    
} from 'antd';
import { DownloadOutlined ,PlusOutlined,DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;


class AskTube extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token:'',
            kinds:[], //分类
            uv:[],
            columns:[
                {
                    title: '问卷id',
                    dataIndex: 'id',
                    align: 'center' 
    
                 },
                  {
                     title: '问卷标题',
                     dataIndex: 'name',
                     align: 'center' 
     
                  },
                  {
                    title: '简介',
                    dataIndex: 'deac',
                    align: 'center' 
                  },
                  {
                    title: '图片',
                    dataIndex: 'show_img',
                    align: 'center' 
                  },

                  {
                    title: '科室分类',
                    dataIndex: 'search_num',
            
                    align: 'center' 
                  },

                  {
                    title: '奖励积分',
                    dataIndex: 'points',
                    align: 'center' 
                  },
                  {
                    title: '已参与/上线人数',
                    dataIndex: 'user_num',
                    align: 'center' 
                  },
                  {
                    title: '修改时间',
                    dataIndex: 'update_time',
                    align: 'center' 
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    align: 'center' 
                  },

                  {
                    title: '操作',
                    dataIndex: 'do',
                    align: 'center' ,
                    render: (text,rows) => (
                        <span>
                            <Button type="primary" size="small" className="mr">查看</Button>
                            <Button type="danger" size="small" onClick={this.showDeleteConfirm.bind(this,text,rows)}>删除</Button>
                        </span> 
                    )
                  }
            ],
            listdata:[],  //表格数据
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,   

            //分页
            totals:"3",  //total
            pageSize:"5",   //每页条数
            pageNum:"1",   //当前页数
            total:"3",

            seach:{
                 title:" ",
                 status:" ",
                 kind:" ",
                 beginTime:" ",
                 endTime:" "
            },

            visible: false,
            addName:""
        }
    };


    //生命周期
    componentDidMount(){
        console.log(this);
        let token=localStorage.getItem('admin_token');
        //获取二级联动
        this.$axios.get(this.$url.attr+token+"?type=3").then((res)=>{
            console.log(res);
            if(res.code==0){
                this.setState({
                    kinds:res.data
                })
            }
        })

        this.getUv(this.state.seach,token);
        this.getTable(this.state.seach,token,1,5);
        
    };
    
    //表格
    getTable(values,sendToken,page,pageSize){
        this.$axios.get(this.$url.askSub+sendToken,{
            page:page,
            pageSize:pageSize,
            name:values.title,
            status:values.status,
            department:values.kind,
            start:values.beginTime,
            end:values.endTime
        }).then((res)=>{
                let arr=[]
                for(let i of res.data.data){
                    arr.push({
                        id:i.id,
                        name:i.name,
                        deac:i.deac,
                        show_img:i.show_img,
                        user_num:i.user_num,
                        points:i.points,
                        search_num:i.search_num,
                        status:i.status,
                        update_time:i.update_time
                    })
                }
                this.setState({
                    listdata:arr
                })
        });
    }

    //uv
    getUv(values,sendToken){
        if(values.title==undefined){
            this.$axios.get(this.$url.askPv+sendToken,{
                name:"",
                status:"",
                department:"",
                start:"",
                end:""
            }).then((res)=>{
                    console.log(res); 
                    this.setState({
                        uv:[
                            {
                                title:'问卷页pv',
                                num:res.data.questionnairePv
                            },
                            {
                                title:'问卷页uv',
                                num:res.data.questionnaireUv
                            },
                            {
                                title:'问卷页注册用户pv',
                                num:res.data.questionnaireRegisterPv
                            },
                            {
                                title:'问卷页注册用户uv',
                                num:res.data.questionnaireRegisterUv
                            },
                            {
                                title:'回收问卷数',
                                num:res.data.userQuestionnaireNum
                            },
                            {
                                title:'回收率',
                                num:res.data.reclamation+'%'
                            }
                        ],
                    })
                  
            });
        }else{
            this.$axios.get(this.$url.askPv+sendToken,{
                name:values.title,
                status:values.status,
                department:values.kind,
                start:values.beginTime,
                end:values.endTime
            }).then((res)=>{
                    console.log(res); 
                    this.setState({
                        uv:[
                            {
                                title:'问卷页pv',
                                num:res.data.questionnairePv
                            },
                            {
                                title:'问卷页uv',
                                num:res.data.questionnaireUv
                            },
                            {
                                title:'问卷页注册用户pv',
                                num:res.data.questionnaireRegisterPv
                            },
                            {
                                title:'问卷页注册用户uv',
                                num:res.data.questionnaireRegisterUv
                            },
                            {
                                title:'回收问卷数',
                                num:res.data.userQuestionnaireNum
                            },
                            {
                                title:'回收率',
                                num:res.data.reclamation+'%'
                            }
                        ],
                    })
                  
            });
        }
        
    }

    //提交
    onFinish = values => {
        console.log('Received values of form: ', values);
        let sendToken=localStorage.getItem('admin_token');
        //表格数据
       this.getTable(values,sendToken,1,10);

        //uv数据
        this.getUv(values,sendToken) 
    };

    //重置
    onReset = () => {
      console.log("11111")
    };
    
    //下拉选中
    handleChange=(value)=> {
        console.log(`selected ${value}`);
    }

    statusChange=(val)=>{
        console.log(`selected ${val}`);
    }

    //选中时间
    onChange=(date, dateString)=> {
        console.log(date, dateString);
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
    };

    //新建
    addAsk=()=>{
        this.setState({
            visible: true,
        });
    }

    //新建输入框监听
    handName=(e)=>{
        this.setState({
            addName:e.target.value
        })
    }
    //新建ok
    oks=()=>{
        this.setState({
            visible: false,
          });
         this.$axios.post(this.$url.askAdd+localStorage.getItem('admin_token'),{
            name:this.state.addName
         }).then((res)=>{
            if(res.code==0){
                  message.success(res.msg);
                  this.props.history.push('/integral');
            }else{
                message.error(res.msg);
            }
         })
      
    }

    //新建取消
    hideModal = () => {
        this.setState({
          visible: false,
        });
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
                       window.location.reload();
                    }
                })
            },
            onCancel() {
                message.error('您已已取消删除');
            }
        })
    }

    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
                //表格选中的数据
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            //   },
              onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
              },
            //   onSelectAll: (selected, selectedRows, changeRows) => {
            //     console.log(selected, selectedRows, changeRows);
            //   }
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                {/* 标题 */}
                <PageHeader
                    className="site-page-header"
                    title="问卷列表"
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
                                name='title'
                                label='问卷标题'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                <Input placeholder="请填写问卷标题" size="middle" />
                            </Form.Item>
                        </Col>


                        <Col span={6}>
                            <Form.Item
                                name='kind'
                                label='分类'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                <Select placeholder='请选择分类'  onChange={this.handleChange}>
                                   
                                    
                                    {
                                        this.state.kinds.map((val,index)=>{
                                        return  (<Option value={val.name} key={index}>{val.name}</Option>)
                                        })
                                    }
                                </Select>
                                {/* <Cascader options={kinds} onChange={this.handleChange} changeOnSelect /> */}
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name='status'
                                label='状态'
                                rules={[
                                    {
                                        required: false,
                                        message: 'Input something!',
                                    },
                                ]}
                            >
                                 <Select   onChange={this.statusChange}>
                                    <Option value="1">进行中</Option>
                                    <Option value="2">无效</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                   

                    <Row gutter={24}>
                         <Col span={6}>
                            <Form.Item 
                                name='beginTime'
                                label='修改时间'
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
                                name='endTime'
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
                        message="查询结果总计:100"
                        type="info"
                        showIcon
                    />
                 </Col>
               </Row>

                <Row className="dothn">
                    <Button type="primary" size="middle" className="mar" icon={<PlusOutlined />} onClick={this.addAsk}>新建</Button>
                    <Button  size="middle" className="mar" icon={<DownloadOutlined />}  onClick={this.exportExcel}>导出</Button>
                    <Button size="middle" icon={<DeleteOutlined />} onClick={this.onSelectAll}>批量删除</Button>
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

               <Modal
                    title="新建问卷"
                    visible={this.state.visible}
                    onOk={this.oks}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                    >
                     <Row>
                        <Col span={16} style={{display:'flex',flexDirection:"row"}}>
                            <span style={{width:'60px',lineHeight:'33px'}}>标题</span><Input rows={4} value={this.state.addName} onChange={this.handName}/>
                        </Col>
                     </Row>
                     {/* <Row>

                     </Row> */}
                </Modal>
            </div>
        )
    }
}

export default AskTube;