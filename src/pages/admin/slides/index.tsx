import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Switch, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes";
import { logout } from "../../../services/auth";
import {
  deleteSlideabc,
  editSlide,
  getAllSlide,
  getSlideById,
} from "../../../services/slides";
import { ISlide } from "../../../types/slide";

const Slides: React.FC = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [slideEdit, setSlideEdit] = useState<ISlide>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [deleteSlide, setBrandDelete] = useState<string>("");

  const buttonUpdate = (slug: string) => {
    navigate(`/admin/slides/edit/${slug}`);
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
  const changeStatus = async (id: number) => {
    await getSlideById(id.toString())
      .then((data: ISlide) => {
        setSlideEdit(data);
        // await editSlide(newSlide)
        //   .then(() => {
        //     message.success("Thành công!");
        //     navigate(routes.ADMIN_SLIDES);
        //   })
        //   .catch(() => {
        //     message.error("Thất bại!");
        //   });
        message.success("Thành công!");
      })
      .catch(() => {
        message.error("Thất bại!");
      });
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
              record.image ||
              "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"
            }
            alt=""
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.status}
            onChange={() =>{}}
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
          Tất cả sản phẩm trong thương hiệu này sẽ tự động chuyển sang thương
          hiệu mặc định!
        </div>
      </Modal>
    </div>
  );
};

export default Slides;
