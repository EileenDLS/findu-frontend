import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

//一般用function component, 这里的class component是例子
// component的名字首字母一定要大写
class CreatePostButton extends Component {
 state = {
   visible: false,
   confirmLoading: false
 };

 showModal = () => {
   this.setState({
     visible: true
   });
 };

 handleOk = () => {
   this.setState({
     confirmLoading: true
   });

   // get form data
   this.postForm
     .validateFields()  //ant design's function, to verify info
     .then((form) => {
       const { description, uploadPost } = form;  // destruction
       const { type, originFileObj } = uploadPost[0];  //这里可以upload多个file, 而我们这里只取第一个的info
       // how to improve code?
       // 1. whenever you use array[0], make sure its an array
       // 2. convert the “type” variable to lower case first
       const vaildInputType = type.toLowerCase().match(/^(image|video)/g)??[];
       // ?? 前面是null的话就返回后面的[],前面有值的话就返回前面的
       const postType = vaildInputType[0]; //分辨是image或video
       if (postType) {
        // FormData是js自带的，用于短暂存储传送一下数据
         let formData = new FormData();
         formData.append("message", description);
         formData.append("media_file", originFileObj);

         const opt = {
           method: "POST",
           url: `${BASE_URL}/upload`,
           headers: {
             Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
           },
           data: formData
         };

         axios(opt)
           .then((res) => {
             if (res.status === 200) {
               message.success("You post has uploaded successfully!");
               // 清空信息form
               this.postForm.resetFields();
               // 关掉这个modal（信息form）
               this.handleCancel();
               // 转到这个type的tab下面
               this.props.onShowPost(postType);
               // 取消upload的button的转圈圈状态
               this.setState({ confirmLoading: false });
             }
           })
           .catch((err) => {
             console.log("Upload image/video failed: ", err.message);
             message.error("Failed to upload image/video!");
             this.setState({ confirmLoading: false });
           });
       }
     })
     .catch((err) => {
       console.log("err ir validate form -> ", err);
     });
 };

 handleCancel = () => {
   console.log("Clicked cancel button");
   this.setState({
     visible: false
   });
 };

 render() {
   const { visible, confirmLoading } = this.state;
   return (
     <div>
       <Button type="primary" onClick={this.showModal}>
         Post your status
       </Button>
       <Modal
         title="Post your status!"
         open={visible}
         onOk={this.handleOk}
         okText="post"
         confirmLoading={confirmLoading}
         onCancel={this.handleCancel}
       >
         <PostForm ref={(refInstance) => (this.postForm = refInstance)} />
       </Modal>
     </div>
   );
 }
}
export default CreatePostButton;