import { Badge, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../services/auth';

import { useDispatch, useSelector } from 'react-redux';
import CartIcon from '../assets/images/bag.png';
import Logo from '../assets/images/logo.png';
import UserRedIcon from '../assets/images/user-profile-red.png';
import { getAllMenu } from '../services/menu';
import { getAllProductCategories } from '../services/productCategory';
import { getUserInfo } from '../services/user';
import { setTotalCartItem } from '../store/cartSlice';
import { setUserInfo } from '../store/userSlice';
import { IUser } from '../types/auth';
import { IMenu } from '../types/menu';
import { IProductCategory } from '../types/productCategory';
import Search from './Search';
import ShowIcon from './ShowIcon';

export interface INewSearch {
    value: string;
    label: string;
    image: string;
    type: string;
}

const Header: React.FC = () => {

    const dispatch = useDispatch();

    const [hoveredMenu, setHoveredMenu] = useState('');

    const handleMouseEnter = (menuId: string) => {
        setHoveredMenu(menuId);
    };

    const handleMouseLeave = () => {
        setHoveredMenu('');
    };

    const totalCart: number = useSelector((state: any) => state.cart.totalCartItem);

    const [user, setUser] = useState<IUser | null>(null);

    const [cate, setCate] = useState<IProductCategory[]>();

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [dataNSearch, setDataNSearch] = useState<INewSearch[]>([]);

    const [menus, setMenus] = useState<IMenu[]>([]);

    const handleCanel = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        setIsModalOpen(false);
        logout();
        navigate("/login");
    };

    useEffect(() => {
        getAllProductCategories()
            .then((data: IProductCategory[]) => {
                setCate(data);
            })
    }, []);

    useEffect(() => {
        getAllMenu().then((data: IMenu[]) => {
            if (data.length > 0) {
                setMenus(data);
            } else {
                const menuExample: IMenu = {
                    id: 0,
                    name: '',
                    url: '',
                    sortOrder: 0,
                    icon: '',
                    enable: false,
                    parent_id: 0,
                    uiSubmenus: []
                }
                setMenus([menuExample]);
            }
        })
    }, []);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (isLoggedIn() && username) {
            getUserInfo(username)
                .then((userData: IUser) => {
                    setUser(userData);
                    dispatch(setUserInfo({ username: userData.username, role: userData.userRole }));
                })
                .catch((error: Error) => {
                    logout();
                    navigate("/login");
                    console.error('Failed to fetch user information');
                });

            const cart = localStorage.getItem("cart-item");
            if (cart !== null) {
                let count = 0;
                const ic = JSON.parse(cart);
                ic.forEach(() => {
                    count += 1;
                })
                dispatch(setTotalCartItem(count));
            }
        }
    }, [dispatch, navigate]);

    return (
        <>
            <div className='bg-[#cd1818] h-[140px] sm:h-[64px] flex items-center justify-center'>
                <div className='flex flex-col sm:flex-row items-center sm:space-x-10 w-3/5'>
                    <img className='h-[60px] cursor-pointer' src={Logo} alt="" onClick={() => navigate("/")} />
                    <div className='flex justify-center'>
                        <Search options={dataNSearch} valueProps={dataNSearch} setDataNSearch={setDataNSearch}></Search>
                    </div>
                </div>
                <div className='space-x-3 hidden sm:flex'>
                    {
                        menus.map((data: IMenu) => (
                            data.enable &&
                            <div
                                key={data.id}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(data.id.toString())}
                                onMouseLeave={handleMouseLeave}
                            >

                                <a href={data.url} className='flex space-y-1 no-underline flex-col text-white items-center cursor-pointer'>
                                    <div>
                                        {data.icon && <ShowIcon size={18} name={data.icon} />}
                                    </div>
                                    <div className='font-bold whitespace-nowrap text-white'>{data.name}</div>
                                </a>

                                {data.uiSubmenus && data.uiSubmenus.length > 0 && hoveredMenu === data.id.toString() && (
                                    <div className="absolute top-full right-0 bg-gray-200 rounded-md">
                                        {data.uiSubmenus.map((submenu) => (
                                            submenu.enable &&
                                            <a
                                                key={submenu.id}
                                                href={submenu.url}
                                                style={{ whiteSpace: 'nowrap' }}
                                                className="block px-8 py-2 text-gray-800 hover:bg-gray-300 hover:rounded-md no-underline"
                                            >
                                                {submenu.name}
                                            </a>
                                        ))}
                                    </div>
                                )}

                            </div>
                        ))
                    }

                    <Badge className='flex items-center' color='#faad14' count={totalCart}>
                        <div className='flex space-y-1 flex-col text-white items-center cursor-pointer no-underline' onClick={() => navigate("/cart")}>
                            <div><img className='w-6 h-6' src={CartIcon} alt="" /></div>
                            <div className='font-bold whitespace-nowrap'>Giỏ hàng</div>
                        </div>
                    </Badge>
                </div>
            </div>
            <div className='h-[40px] space-x-10 bg-[#333] text-white whitespace-nowrap w-full overflow-x-auto flex items-center px-4 sm:px-0 sm:justify-center'>
                {
                    cate && cate.map((cate: IProductCategory) => (
                        <div key={cate.id} className='text-white cursor-pointer hover:font-bold'>
                            {cate.name}
                        </div>
                    ))
                }

            </div>
            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Thông tin cá nhân"
                open={isModalOpen}
                onOk={handleLogout}
                onCancel={handleCanel}
                okText="Đăng xuất"
            >
                <div className='flex flex-col items-center'>
                    <div><img className='w-32' src={UserRedIcon} alt='' /></div>
                    <div className='font-bold text-3xl mb-3'>
                        {user?.name}
                    </div>
                    <div>
                        <div>
                            <b>Email:</b> {user?.email}
                        </div>
                        <div>
                            <b>Username:</b> {user?.username}
                        </div>
                        <div>
                            <b>Phone:</b> {user?.phone}
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    )
}

export default Header;