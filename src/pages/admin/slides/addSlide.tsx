import { Button, Form, Input, Switch, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadSingleImage from "../../../components/SingleUploadImage";
import routes from "../../../routes";
import { isLoggedIn } from "../../../services/auth";
import { ISlide } from "../../../types/slide";
import { addSlide } from "../../../services/slides";

const AddSlide: React.FC = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    const username = localStorage.getItem("username");

    if (isLoggedIn() && username) {
      const slide: ISlide = {
        id: 0,
        name: values.name,
        image: image,
        slug: values.url,
        status: values.status,
      };

      console.log(slide);

      await addSlide(slide)
        .then(() => {
          message.success("Thành công!");
          navigate(routes.ADMIN_SLIDES);
        })
        .catch(() => {
          message.error("Thất bại!");
        });
    } else {
      message.success("Hết hạn, đăng nhập lại!");
      navigate(routes.LOGIN);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Form
        name="newBlogForm"
        layout="vertical"
        labelCol={{ span: 8 }}
        style={{ minWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Tiêu đề"
          name="name"
          rules={[{ required: true, message: "Hãy nhập tiêu đề!" }]}
        >
          <Input size="large" placeholder="Tiêu đề nhãn hàng!" />
        </Form.Item>
        <Form.Item label="Hiển thị" name="status" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          label="URL"
          name="url"
          rules={[{ required: true, message: "Hãy nhập tiêu đề!" }]}
        >
          <Input size="large" placeholder="Tiêu đề nhãn hàng!" />
        </Form.Item>

        <UploadSingleImage valueProps={image} setValueProps={setImage} />

        <Button
          type="primary"
          className="bg-[#CD1818] hover:bg-[#6d6d6d] my-3"
          htmlType="submit"
        >
          Thêm mới
        </Button>
      </Form>
    </div>
  );
};

export default AddSlide;
