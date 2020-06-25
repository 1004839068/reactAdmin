import React,{Component} from "react";
// import { Form, Input, Button, Radio, Col,Select   } from 'antd';


class Forms extends Component{
    constructor(props){
        super(props);
        this.state={
             title:'表单'
        }
    }



    render(){
     
        return (
            <div>
               
              {this.state.title}  
            </div>
        )
    }
}

export default Forms;