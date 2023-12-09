import React, { forwardRef } from "react";
import { Form, Upload, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const PostForm = forwardRef((props, formRef) => {
 const formItemLayout = {
    //占多少列
    labelCol: { span: 6 },
   wrapperCol: { span: 14 }
 };


 const normFile = (e) => {
   console.log("Upload event:", e);
   // check e是否是一个array
   if (Array.isArray(e)) {
     return e;
   }
   // e是null/undefined则返回null/undefined,如果e存在，则把e的fileList拿出来
   return e && e.fileList;
 };
 return (
    // ref={formRef}: 指针，别人可以通过这个reference来找到这个form 
   <Form name="validate_other" {...formItemLayout} ref={formRef}>
     <Form.Item
       name="description"
       label="Message"
       rules={[
         {
           required: true,
           message: "Please input your Message!"
         }
       ]}
     >
       <Input />
     </Form.Item>
     <Form.Item label="Dragger">
       <Form.Item
         name="uploadPost"
         valuePropName="fileList"
         getValueFromEvent={normFile}
         noStyle
         rules={[
           {
             required: true,
             message: "Please select an image/video!"
           }
         ]}
       >
         <Upload.Dragger name="files" beforeUpload={() => false}>
           <p className="ant-upload-drag-icon">
            <UploadOutlined />
            {/* <InboxOutlined /> */}
           </p>
           <p className="ant-upload-text">
             Click or drag your file to here
           </p>
         </Upload.Dragger>
       </Form.Item>
     </Form.Item>
   </Form>
 );
});