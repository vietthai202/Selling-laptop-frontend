
import { BlockOutlined, FileTextOutlined, LaptopOutlined, SlackSquareOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
const { Content, Footer, Sider } = Layout;

const AdminLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navigate = useNavigate();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const menu = [
        {
            key: "users",
            icon: React.createElement(UserOutlined),
            label: `Người dùng`,
        },
        {
            key: "blog-categories",
            icon: React.createElement(BlockOutlined),
            label: `Danh mục tin`,
        },
        {
            key: "blogs",
            icon: React.createElement(FileTextOutlined),
            label: `Tin tức`,
        },
        {
            key: "brands",
            icon: React.createElement(SlackSquareOutlined),
            label: `Thương hiệu`,
        },
        {
            key: "product-categories",
            icon: React.createElement(BlockOutlined),
            label: `Danh mục sản phẩm`,
        },
        {
            key: "products",
            icon: React.createElement(LaptopOutlined),
            label: `Sản phẩm`,
        },

    ]

    return (
        <Layout>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical">
                    <img className='h-[50px]' src={Logo} alt="" />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[currentPath.split("/")[2]]}
                    onClick={({ key }) => {
                        navigate(`/admin/${key}`)
                    }}
                    items={menu}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: "100%", background: colorBgContainer }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>© 2023. All rights reserved.</Footer>
            </Layout>
        </Layout>
    )
}

export default AdminLayout;