import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BsArrowsMove } from "react-icons/bs";
import { Button, Form, Input, Modal, Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import DeleteModal from '../../../../components/DeleteModal';
import ShowIcon from "../../../../components/ShowIcon";
import { createMenu, createSubMenu, deleteMenuById, deleteSubMenu, getAllMenu, updateMenu, updatePositions, updateSubMenu } from "../../../../services/menu";
import { IMenu, ISubMenu } from "../../../../types/menu";
import IconSelectionModal from '../../../../components/ModalSelectIcon';

const SettingFooter: React.FC = () => {

    const [menus, setMenus] = useState<IMenu[]>([]);
    const [editData, setEditData] = useState<IMenu | null>(null);
    const [totalMenu, setTotalMenu] = useState<number>(4);

    const [editDataId, setEditDataId] = useState<string | null>(null);
    const [typeShow, setTypeShow] = useState<string | null>(null);

    const [editDataName, setEditDataName] = useState<string>("");
    const [editDataUrl, setEditDataUrl] = useState<string>("");
    const [editDataIcon, setEditDataIcon] = useState<string>("");
    const [editDataShow, setEditDataShow] = useState<boolean>(true);
    const [showIconOnEdit, setShowIconOnEdit] = useState<boolean>(false);

    const [change, setChange] = useState<boolean>(false);

    const handleAddNewSubMenuClick = (data: IMenu) => {
        setEditDataId(data.id.toString());
    };

    const handleAddNewSubMenuSubmit = () => {
        console.log(editDataId, editDataName, editDataUrl, editDataIcon, editDataShow);
        const newMenu: ISubMenu = {
            id: 0,
            name: editDataName,
            url: editDataUrl,
            sortOrder: 0,
            icon: editDataIcon,
            enable: editDataShow,
            menu_id: Number(editDataId)
        }

        createSubMenu(newMenu).then(() => {
            setChange(!change);
            message.success("Tạo thành công!");
        }).catch(() => {
            message.error("Tạo thất bại!");
        }).finally(() => {
            onCancelAddNewSubMenu();
        })
    };

    const handleAddNewMenuClick = () => {
        setEditDataId("0");
    };

    const handleAddNewMenuSubmit = () => {
        const newMenu: IMenu = {
            id: 0,
            name: editDataName,
            url: editDataUrl,
            sortOrder: 0,
            icon: editDataIcon,
            enable: editDataShow,
            parent_id: 0,
            uiSubmenus: [],
            menuType: "FOOTER"
        }

        createMenu(newMenu).then(() => {
            setChange(!change);
            message.success("Tạo thành công!");
        }).catch(() => {
            message.error("Tạo thất bại!");
        }).finally(() => {
            onCancelAddNewSubMenu();
        })
    };

    const onCancelAddNewSubMenu = () => {
        setEditDataId(null);
        setEditDataName("");
        setEditDataUrl("");
        setEditDataIcon("");
        setEditDataShow(false);
        setTypeShow(null);
    }

    const onCancelEdit = () => {
        setEditData(null);
        setEditDataName("");
        setEditDataUrl("");
        setEditDataIcon("");
        setEditDataShow(false);
    }

    const handleEditMenuClick = (data: IMenu) => {
        setEditDataName(data.name);
        setEditDataUrl(data.url);
        setEditDataIcon(data.icon);
        setEditDataShow(data.enable);
        setEditData(data);
    };

    const handleEdiSubMenuClick = (data: ISubMenu) => {
        setEditDataId(data.id.toString());
        setEditDataName(data.name);
        setEditDataUrl(data.url);
        setEditDataIcon(data.icon);
        setEditDataShow(data.enable);
        console.log(data);
        setTypeShow("editsubmenu");
    };

    const onShowHideChange = (checked: boolean) => {
        setEditDataShow(checked);
    };

    const handleEditMenuSubmit = () => {
        if (editData) {
            const newMenu: IMenu = editData;
            newMenu.name = editDataName;
            newMenu.url = editDataUrl;
            newMenu.icon = editDataIcon;
            if (editDataShow !== null && editDataShow !== undefined) {
                newMenu.enable = editDataShow;
            } else {
                newMenu.enable = false;
            }

            console.log(newMenu);
            updateMenu(newMenu).then(() => {
                setChange(!change);
                message.success("Cập nhật thành công!");
            }).catch(() => {
                message.error("Cập nhật thất bại!");
            }).finally(() => {
                onCancelEdit();
            })
        }
    };

    const handleEditSubMenuSubmit = () => {
        const newMenu: ISubMenu = {
            id: Number(editDataId),
            name: editDataName,
            url: editDataUrl,
            sortOrder: 0,
            icon: editDataIcon,
            enable: editDataShow,
            menu_id: 0,
        }

        updateSubMenu(newMenu).then(() => {
            setChange(!change);
            message.success("Cập nhật thành công!");
        }).catch(() => {
            message.error("Cập nhật thất bại!");
        }).finally(() => {
            onCancelAddNewSubMenu();
        })
    };

    useEffect(() => {
        getAllMenu("FOOTER").then((data: IMenu[]) => {
            if (data.length > 0) {
                setMenus(data);
                setTotalMenu(data.length);
            }
        })
    }, [change]);

    const handleDragMenu = (result: DropResult) => {
        if (!result.destination) return;

        const updatedMenus = Array.from(menus);
        const [movedMenu] = updatedMenus.splice(result.source.index, 1);
        updatedMenus.splice(result.destination.index, 0, movedMenu);

        updatedMenus.forEach((menu, index) => {
            menu.sortOrder = index + 1;
        });

        setMenus(updatedMenus);

        updatePositions(updatedMenus)
            .then(() => {
                message.success("Cập nhật thành công!");
            })
            .catch(() => {
                message.error("Cập nhật thất bại!");
            });
    };

    const handleDragSubMenu = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === 'submenu') {
            const sourceMenuId = parseInt(source.droppableId);
            const destinationMenuId = parseInt(destination.droppableId);
            const updatedMenus = Array.from(menus);

            const sourceMenu = updatedMenus.find((menu) => menu.id === sourceMenuId);
            const destinationMenu = updatedMenus.find((menu) => menu.id === destinationMenuId);

            if (sourceMenu && destinationMenu) {
                const movedSubmenu = sourceMenu.uiSubmenus.splice(source.index, 1)[0];
                destinationMenu.uiSubmenus.splice(destination.index, 0, movedSubmenu);
            }

            setMenus(updatedMenus);

            updatePositions(updatedMenus)
                .then(() => {
                    message.success("Cập nhật thành công!");
                })
                .catch(() => {
                    message.error("Cập nhật thất bại!");
                });
        }
    };


    const deleteById = (id: string, onSuccess: () => void) => {
        deleteMenuById(id).then(() => {
            onSuccess();
            setChange(!change);
        }).catch(() => {
            message.error("Xóa thất bại!");
        });
    }

    const deleteSubMenuById = (id: string, onSuccess: () => void) => {
        deleteSubMenu(id).then(() => {
            onSuccess();
            setChange(!change);
        }).catch(() => {
            message.error("Xóa thất bại!");
        });
    }

    return (

        <>
            <div className='flex items-center space-x-4 mb-3'>
                <div className="font-bold text-lg">
                    Kéo thả để sắp xếp menu
                </div>
                {
                    totalMenu < 4 &&
                    <Button danger size='small' icon={<PlusOutlined />} onClick={handleAddNewMenuClick}>
                        Thêm
                    </Button>
                }
            </div >

            <div className="flex mb-2">
                <DragDropContext onDragEnd={handleDragMenu}>
                    <Droppable droppableId="menuList">
                        {(provided) => (
                            <div className="flex flex-col" {...provided.droppableProps} ref={provided.innerRef}>
                                {menus.map((menu, index) => (
                                    <Draggable key={menu.id} draggableId={menu.id.toString()} index={index}>
                                        {(provided) => (
                                            <>
                                                <div
                                                    className="flex items-center space-x-2"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <BsArrowsMove />
                                                    <div className='flex items-center justify-start space-x-2 px-4 py-2 my-2 bg-red-400 rounded-md w-fit text-white'>
                                                        <div>
                                                            {menu.icon && <ShowIcon className='h-6 w-6' name={menu.icon} />}
                                                        </div>
                                                        <div>
                                                            {menu.name}
                                                        </div>
                                                    </div>
                                                    <Button danger icon={<EditOutlined />} onClick={() => handleEditMenuClick(menu)}>
                                                        Sửa
                                                    </Button>
                                                    <DeleteModal id={menu.id.toString()} onDelete={deleteById} onSuccess={() => { message.success("Xóa thành công!"); }} />
                                                </div>
                                            </>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <Modal
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                open={editDataId === "0"}
                onOk={handleAddNewMenuSubmit}
                okText={'Thêm menu'}
                onCancel={onCancelAddNewSubMenu}
            >
                {editDataId && (
                    <div className='flex flex-col'>
                        <h3> Thêm mới footer headline</h3>
                        <Form.Item
                            label="Name"
                        >
                            <Input value={editDataName} placeholder='Dịch vụ' onChange={(e) => { setEditDataName(e.target.value) }} />
                        </Form.Item>
                        <Form.Item
                            label="URL"
                        >
                            <Input value={editDataUrl} placeholder='https://google.com or /blogs' onChange={(e) => { setEditDataUrl(e.target.value) }} />
                        </Form.Item>
                        <Form.Item
                            label="Icon"
                        >
                            <div className='flex items-center space-x-2'>
                                <ShowIcon name={editDataIcon || "FcAddImage"} size={34} onClick={() => { setShowIconOnEdit(true) }} />
                                <IconSelectionModal visible={showIconOnEdit} onClose={() => { setShowIconOnEdit(false) }} onSelectIcon={setEditDataIcon} />
                            </div>
                        </Form.Item>
                        <div>
                            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" defaultChecked={editDataShow} onChange={onShowHideChange} />
                        </div>

                    </div>
                )}
            </Modal >

            <Modal
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                open={editDataId !== null && editDataId !== "0" && typeShow !== "editsubmenu"}
                onOk={handleAddNewSubMenuSubmit}
                okText={'Thêm submenu'}
                onCancel={onCancelAddNewSubMenu}
            >
                {editDataId && (
                    <div className='flex flex-col'>
                        <h3> Thêm mới submenu</h3>
                        <Form.Item
                            label="Name"
                        >
                            <Input value={editDataName} placeholder='Blog tin tức...' onChange={(e) => { setEditDataName(e.target.value) }} />
                        </Form.Item>
                        <Form.Item
                            label="URL"
                        >
                            <Input value={editDataUrl} placeholder='https://google.com or /blogs' onChange={(e) => { setEditDataUrl(e.target.value) }} />
                        </Form.Item>
                        <Form.Item
                            label="Icon"
                        >
                            <div className='flex items-center space-x-2'>
                                <ShowIcon name={editDataIcon || "FcAddImage"} size={34} onClick={() => { setShowIconOnEdit(true) }} />
                                <IconSelectionModal visible={showIconOnEdit} onClose={() => { setShowIconOnEdit(false) }} onSelectIcon={setEditDataIcon} />
                            </div>
                        </Form.Item>
                        <div>
                            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" defaultChecked={editDataShow} onChange={onShowHideChange} />
                        </div>

                    </div>
                )}
            </Modal >

            <Modal
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                open={editData !== null}
                onOk={handleEditMenuSubmit}
                okText={'Cập nhật'}
                onCancel={onCancelEdit}
            >
                {editData && (
                    <div className='flex flex-col'>
                        <h3> Sửa menu #{editData.id}</h3>
                        <Form.Item
                            label="Name"
                        >
                            <Input value={editDataName} placeholder='Blog tin tức...' onChange={(e) => { setEditDataName(e.target.value) }} />
                        </Form.Item>
                        <Form.Item
                            label="URL"
                        >
                            <Input value={editDataUrl} placeholder='https://google.com or /blogs' onChange={(e) => { setEditDataUrl(e.target.value) }} />
                        </Form.Item>
                        <Form.Item
                            label="Icon"
                        >
                            <div className='flex items-center space-x-2'>
                                <ShowIcon name={editDataIcon || "FcAddImage"} size={34} onClick={() => { setShowIconOnEdit(true) }} />
                                <IconSelectionModal visible={showIconOnEdit} onClose={() => { setShowIconOnEdit(false) }} onSelectIcon={setEditDataIcon} />
                            </div>
                        </Form.Item>
                        <div>
                            <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" defaultChecked={editDataShow} onChange={onShowHideChange} />
                        </div>

                    </div>
                )}
            </Modal>

            <Modal
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                open={typeShow !== null && typeShow === "editsubmenu"}
                onOk={handleEditSubMenuSubmit}
                okText={'Cập nhật submenu'}
                onCancel={onCancelAddNewSubMenu}
            >
                <div className='flex flex-col'>
                    <h3> Sửa sub menu #{editDataId}</h3>
                    <Form.Item
                        label="Name"
                    >
                        <Input value={editDataName} placeholder='Blog tin tức...' onChange={(e) => { setEditDataName(e.target.value) }} />
                    </Form.Item>
                    <Form.Item
                        label="URL"
                    >
                        <Input value={editDataUrl} placeholder='https://google.com or /blogs' onChange={(e) => { setEditDataUrl(e.target.value) }} />
                    </Form.Item>
                    <Form.Item
                        label="Icon"
                    >
                        <div className='flex items-center space-x-2'>
                            <ShowIcon name={editDataIcon || "FcAddImage"} size={34} onClick={() => { setShowIconOnEdit(true) }} />
                            <IconSelectionModal visible={showIconOnEdit} onClose={() => { setShowIconOnEdit(false) }} onSelectIcon={setEditDataIcon} />
                        </div>
                    </Form.Item>
                    <div>
                        <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" defaultChecked={editDataShow} onChange={onShowHideChange} />
                    </div>
                </div>
            </Modal>

            <div className="grid grid-cols-1 xl:grid-cols-1 md:grid-cols-4 gap-5">
                <DragDropContext onDragEnd={handleDragSubMenu}>
                    {menus.map((menu) => (
                        <div
                            key={menu.id.toString()}
                            className="p-4 border border-gray-300 rounded shadow mr-4 w-fit max-w-[400px]"
                        >
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className="">{menu.name}</h3>

                                <div className=''>
                                    <Button danger size='small' icon={<PlusOutlined />} onClick={() => { handleAddNewSubMenuClick(menu) }}>
                                        Thêm
                                    </Button>
                                </div>
                            </div>
                            <Droppable droppableId={menu.id.toString()} type="submenu">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="bg-gray-100 rounded p-2"
                                    >
                                        {menu.uiSubmenus.map((submenu, submenuIndex) => (
                                            <Draggable
                                                key={submenu.id.toString()}
                                                draggableId={submenu.id.toString()}
                                                index={submenuIndex}
                                            >
                                                {(provided, snapshot) => (
                                                    <div className='flex items-center space-x-2'>
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white border border-gray-300 rounded p-2 mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                        >
                                                            {submenu.name}
                                                        </div>
                                                        <Button danger icon={<EditOutlined />} size='small' onClick={() => handleEdiSubMenuClick(submenu)}></Button>
                                                        <DeleteModal id={submenu.id.toString()} onDelete={deleteSubMenuById} onSuccess={() => { message.success("Xóa thành công!"); }} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </DragDropContext>
            </div>
        </>

    )
}

export default SettingFooter;