import { Button, Form, Input, Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import routes from "../../../routes";
import { isLoggedIn, logout } from "../../../services/auth";
import UploadSingleImage from "../../../components/SingleUploadImage";
import { ISlide } from "../../../types/slide";
import { editSlide, getSlideById } from "../../../services/slides";

const { TextArea } = Input;

const EditSlide: React.FC = () => {
  const navigate = useNavigate();
  const param: any = useParams();
  console.log(param);
  const [image, setImage] = useState<string | null>(null);

  const [slide, setSlide] = useState<ISlide>();

  const onFinish = async (values: any) => {
    const username = localStorage.getItem("username");

    if (isLoggedIn() && username && slide) {
      const newSlide: ISlide = slide;
      newSlide.name = values.name;
      newSlide.image = image;
      newSlide.slug = values.slug;
      newSlide.status = values.status;

      await editSlide(newSlide)
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

  useEffect(() => {
    if (param) {
      getSlideById(param.slug)
        .then((data: ISlide) => {
          setSlide(data);
          setImage(data.image);
          console.log(data);
        })
        .catch(() => {
          message.error("Có lỗi khi lấy dữ liệu!");
          // logout();
          // navigate("/admin/login");
        });
    }
  }, [navigate, param]);

  return (
    <div>
      {slide && (
        <Form
          name="newBlogForm"
          layout="vertical"
          labelCol={{ span: 8 }}
          style={{ minWidth: 400 }}
          initialValues={slide}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Slide"
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
            name="slug"
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
            Cập nhật
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EditSlide;
