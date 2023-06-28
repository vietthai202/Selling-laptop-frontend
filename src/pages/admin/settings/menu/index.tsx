import { EditOutlined } from '@ant-design/icons';
import { BsArrowsMove } from "react-icons/bs";
import { Button, Form, Input, Modal, Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import DeleteModal from '../../../../components/DeleteModal';
import ShowIcon from "../../../../components/ShowIcon";
import { deleteMenuById, getAllMenu, updateMenu, updatePositions } from "../../../../services/menu";
import { IMenu } from "../../../../types/menu";
import IconSelectionModal from '../../../../components/ModalSelectIcon';

const SettingMenu: React.FC = () => {

    const [menus, setMenus] = useState<IMenu[]>([]);
    const [editData, setEditData] = useState<IMenu | null>(null);
    const [editDataName, setEditDataName] = useState<string>("");
    const [editDataUrl, setEditDataUrl] = useState<string>("");
    const [editDataIcon, setEditDataIcon] = useState<string>("");
    const [editDataShow, setEditDataShow] = useState<boolean>(false);
    const [showIconOnEdit, setShowIconOnEdit] = useState<boolean>(false);

    const [change, setChange] = useState<boolean>(false);

    const handleEditMenuClick = (data: IMenu) => {
        setEditDataName(data.name);
        setEditDataUrl(data.url);
        setEditDataIcon(data.icon);
        setEditDataShow(data.enable);
        setEditData(data);
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
                setEditData(null);
            })
        }
    };


    useEffect(() => {
        getAllMenu().then((data: IMenu[]) => {
            setMenus(data);
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

    return (

        <>
            <div className="mb-3 font-bold text-lg">
                Kéo thả để sắp xếp menu
            </div>

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
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                open={editData !== null}
                onOk={handleEditMenuSubmit}
                okText={'Cập nhật'}
                onCancel={() => setEditData(null)}
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
            </Modal >

            <div className="flex">
                <DragDropContext onDragEnd={handleDragSubMenu}>
                    {menus.map((menu) => (
                        <div
                            key={menu.id.toString()}
                            className="p-4 border border-gray-300 rounded shadow mr-4"
                            style={{ width: '250px' }}
                        >
                            <h3 className="mb-4">{menu.name}</h3>
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
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white border border-gray-300 rounded p-2 mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                    >
                                                        {submenu.name}
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

export default SettingMenu;