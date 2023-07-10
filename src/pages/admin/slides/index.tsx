import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Switch, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes";
import { logout } from "../../../services/auth";
import {
  deleteSlideabc,
  getAllSlide,
  onOffSlide
} from "../../../services/slides";
import { ISlide } from "../../../types/slide";

const Slides: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [deleteSlide, setBrandDelete] = useState<string>("");

  const buttonUpdate = (slug: string) => {
    navigate(`/admin/setting/slides/edit/${slug}`);
  };

  const buttonDelete = (blogid: string) => {
    setIsDeleteOpen(true);
    setBrandDelete(blogid);
  };

  const doDelete = () => {
    if (deleteSlide) {
      deleteSlideabc(deleteSlide)
        .then((data: any) => {
          setIsDeleteOpen(false);
          setBrandDelete("");
          message.success(data.message);
        })
        .catch(() => {
          setIsDeleteOpen(false);
          setBrandDelete("");
          message.error("Có lỗi khi xóa slide!");
        });
    }
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
  };

  useEffect(() => {
    getAllSlide()
      .then((data: any) => {
        console.log(data);
        setDataSource(data);
      })
      .catch(() => {
        logout();
        navigate("/login");
        console.error("Failed to fetch blog information");
      });
  }, [navigate, deleteSlide]);

  const columns: ColumnsType<ISlide> = [
    {
      title: "Slide",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (_, record) => {
        return (
          <img
            className="w-48 h-20"
            src={
              record.imageUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"
            }
            alt=""
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "enable",
      key: "enable",
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.enable}
            onChange={() => {
              onOffSlide(record.id).then(() => { message.success("Cập nhật thành công!") }).catch(() => { message.error("Cập nhật thất bại!") });
            }}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button onClick={() => buttonUpdate(record.id.toString())}>
              Sửa
            </Button>
            <Button danger onClick={() => buttonDelete(record.id.toString())}>
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        href={routes.ADMIN_SLIDES_ADDNEW}
        className="mb-4"
        danger
        icon={<PlusOutlined />}
      >
        Thêm Slide
      </Button>

      <Table rowKey="id" columns={columns} dataSource={dataSource} />

      <Modal
        okButtonProps={{ style: { backgroundColor: "#CD1818" } }}
        title="Xóa thương hiệu!"
        open={isDeleteOpen}
        onOk={doDelete}
        onCancel={cancelDelete}
        okText="Xóa"
      >
        <div className="flex flex-col items-center">
          Bạn có chắc chắn muốn xóa!
        </div>
      </Modal>
    </div>
  );
};

export default Slides;
