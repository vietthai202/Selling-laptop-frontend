import { AimOutlined, AppstoreOutlined, CommentOutlined, EyeOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../services/auth';
import TabAddressReceive from './tabs/TabAddressReceive';
import TabEditProfile from './tabs/TabEditProfile';
import TabGuarantee from './tabs/TabGuarantee';
import TabProfileOrder from './tabs/TabProfileOrder';
import TabResentlyViewed from './tabs/TabResentlyViewed';
import TabReviewProduct from './tabs/TabReviewProduct';

const { TabPane } = Tabs;

const Profile: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login");
        }
    }, [navigate]);


    return (
        <div className='container mt-5 mx-auto my-auto'>
            <Tabs tabPosition="left" defaultActiveKey={"0"}>
                <TabPane
                    tab={
                        <span>
                            <UserOutlined />
                            Chỉnh sửa tài khoản
                        </span>
                    }
                    key="0"
                >
                    <TabEditProfile />
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <AppstoreOutlined />
                            Đơn hàng của tôi
                        </span>
                    }
                    key="1"
                >
                    <TabProfileOrder />
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <AimOutlined />
                            Sổ địa chỉ nhận hàng
                        </span>
                    }
                    key="2"
                >
                    <TabAddressReceive />
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <CommentOutlined />
                            Đánh giá sản phẩm
                        </span>
                    }
                    key="3"
                >
                    <TabReviewProduct />
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <EyeOutlined />
                            Sản phẩm vừa mới xem
                        </span>
                    }
                    key="4"
                >
                    <TabResentlyViewed />
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <SafetyOutlined />
                            Bảo hành
                        </span>
                    }
                    key="5"
                >
                    <TabGuarantee />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Profile;
