import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { getUserInfo, isLoggedIn, logout } from '../services/auth';

import Logo from '../assets/images/logo.png'
import UserIcon from '../assets/images/user-profile.png'
import UserRedIcon from '../assets/images/user-profile-red.png'
import PhoneIcon from '../assets/images/telephone.png'
import InfoIcon from '../assets/images/document.png'
import CartIcon from '../assets/images/bag.png'
import { IUser } from '../types/auth';
import routes from '../routes';
import { IProductCategory } from '../types/productCategory';
import { getAllProductCategories } from '../services/productCategory';

const Header: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(null);

    const [cate, setCate] = useState<IProductCategory[]>();

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

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
                })
                .catch((error: Error) => {
                    logout();
                    navigate("/login");
                    console.error('Failed to fetch user information');
                });
        }
    }, [navigate]);

    return (
        <>
            <div className='bg-[#cd1818] h-[64px] flex items-center justify-center'>
                <div className='flex items-center space-x-10 w-3/5'>
                    <img className='h-[60px] cursor-pointer' src={Logo} alt="" onClick={() => navigate("/")} />
                    <div className='flex'>
                        <input className='h-[40px] min-w-[300px] w-[100%] p-3 ring-0 rounded-l-md border-none focus:outline-none' placeholder='Tìm kiếm sản phẩm....' type='text' ></input>
                        <button className='h-[40px] whitespace-nowrap	 rounded-r-md cursor-pointer text-white bg-[#333] border-none'>Tìm kiếm</button>
                    </div>
                </div>
                <div className='flex space-x-3'>
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

                    <div className='flex space-y-1 flex-col text-white items-center cursor-pointer no-underline'>
                        <div><img className='w-6' src={CartIcon} alt="" /></div>
                        <div className='font-bold whitespace-nowrap'>Giỏ hàng</div>
                    </div>
                </div>
            </div>
            <div className='h-[40px] space-x-4 bg-[#333] text-white flex items-center justify-center'>
                {
                    cate && cate.map((cate: IProductCategory) => (
                        <Button href={cate.slug}>
                            {cate.name}
                        </Button>
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