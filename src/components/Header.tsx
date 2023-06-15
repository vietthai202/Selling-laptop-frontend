import { Badge, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo, isLoggedIn, logout } from '../services/auth';

import CartIcon from '../assets/images/bag.png';
import InfoIcon from '../assets/images/document.png';
import Logo from '../assets/images/logo.png';
import PhoneIcon from '../assets/images/telephone.png';
import UserRedIcon from '../assets/images/user-profile-red.png';
import UserIcon from '../assets/images/user-profile.png';
import routes from '../routes';
import { getAllProductCategories } from '../services/productCategory';
import { IUser } from '../types/auth';
import { IProductCategory } from '../types/productCategory';
import Search from './Search';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalCartItem } from '../store/cartSlice';
import { setUserInfo } from '../store/userSlice';

export interface INewSearch {
    value: string;
    label: string;
    image: string;
    type: string;
}

const Header: React.FC = () => {

    const dispatch = useDispatch();

    const totalCart: number = useSelector((state: any) => state.cart.totalCartItem);

    const [user, setUser] = useState<IUser | null>(null);

    const [cate, setCate] = useState<IProductCategory[]>();

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [dataNSearch, setDataNSearch] = useState<INewSearch[]>([]);

    const showProfile = () => {
        if (isLoggedIn()) {
            setIsModalOpen(true);
        } else {
            navigate("/login");
        }
    };

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
                    <a href='tel:0352918986' className='flex space-y-1 no-underline flex-col text-white items-center cursor-pointer'>
                        <div><img className='w-6' src={PhoneIcon} alt="" /></div>
                        <div className='font-bold whitespace-nowrap text-white'>0352918986</div>
                    </a>

                    <Link to={routes.BLOGS} className='flex space-y-1 flex-col text-white items-center cursor-pointer no-underline'>
                        <div><img className='w-6' src={InfoIcon} alt="" /></div>
                        <div className='font-bold whitespace-nowrap'>Thông tin hay</div>
                    </Link>

                    <div onClick={showProfile} className='flex space-y-1 flex-col text-white items-center cursor-pointer no-underline'>
                        <div><img className='w-6' src={UserIcon} alt="" /></div>
                        <div className='font-bold whitespace-nowrap'>Tài khoản</div>
                    </div>

                    <Badge color='#faad14' count={totalCart}>
                        <div className='flex space-y-1 flex-col text-white items-center cursor-pointer no-underline' onClick={() => navigate("/cart")}>
                            <div><img className='w-6' src={CartIcon} alt="" /></div>
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