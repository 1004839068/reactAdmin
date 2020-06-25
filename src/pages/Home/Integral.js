import React,{Component} from "react";
import '../../assets/css/App.css';
import '../../assets/css/Home/Integral.css';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom"; //路由 
import { PageHeader,Row,Col,Button, Upload, message,Checkbox} from 'antd';
import { LoadingOutlined, PlusOutlined,DeleteOutlined,ArrowUpOutlined,ArrowDownOutlined,FormOutlined} from '@ant-design/icons';

//上传图片
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

class Integral extends Component{
    constructor(props){
        super(props);
        this.state={
            loading: false,
        }
    };

    //选择图片
    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
    };

    //多选
    onChange=(checkedValues)=> {
        console.log('checked = ', checkedValues);
    }
    
    render(){
        const uploadButton = (
            <div>
              {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const { imageUrl } = this.state;
        return(
           <div className='bgs'>

               <PageHeader
                    className="site-page-header"
                    title="创建问卷"
                    style={{background:"#ffffff",marginBottom:"16px"}}
                />

                <Row gutter={24} justify="space-around">
                    <Col className="gutter-row" span={5} className="rowL">
                        <div className="rowL">
                            <div className="adds">添加问题类型</div>
                            <Button className="btns">单选题</Button>
                            <Button className="btns">多选题</Button>
                            <Button className="btns">单行文本</Button>
                            <Button className="btns">多行文本</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={18} className="rowL">
                        <div className="rowR">
                            <div className="askTitle">问卷标题</div>
                            <div className='askYj'>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视
                                每位用户的宝贵意见，期待您的参与!现在我们就马上开始吧!
                            </div>
                            <div className='upWord'>上传封面图<span style={{color:'#ff3400'}}>*</span></div>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>

                            <div className='ques'>1.对于胃炎您通常开那些药品<span style={{color:'#ff3400'}}>*</span></div>
                            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} style={{marginBottom:'18px'}}>
                                <Row>
                                    <Col span={24}>
                                        <Checkbox value="A">奥美拉唑</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="B">斯达舒</Checkbox>
                                    </Col>
                                    <Col span={24}>
                                        <Checkbox value="C">香砂养胃丸</Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                            <div className='doSection'>
                                <Button size='small' icon={<FormOutlined />}>编辑</Button>
                                <Button size='small' icon={<DeleteOutlined />}>删除</Button>
                                <Button size='small' icon={<ArrowUpOutlined  />}>上移</Button>
                                <Button size='small' icon={<ArrowDownOutlined  />}>下移</Button>
                            </div>
                        </div>
                    </Col>
                </Row> 

           </div>
        )
    }
}

export default Integral;