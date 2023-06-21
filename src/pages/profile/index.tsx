import { AimOutlined, AppstoreOutlined, CommentOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React from 'react';
import TabProfileOrder from './tabs/TabProfileOrder';
import TabAddressReceive from './tabs/TabAddressReceive';
import TabReviewProduct from './tabs/TabReviewProduct';
import TabResentlyViewed from './tabs/TabResentlyViewed';
import TabEditProfile from './tabs/TabEditProfile';

const { TabPane } = Tabs;

const Profile: React.FC = () => {



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
            </Tabs>
        </div>
    );
};

export default Profile;
