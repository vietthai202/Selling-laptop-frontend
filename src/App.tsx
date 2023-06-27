import { Route, Routes } from 'react-router-dom';
import './App.css';
import AdminLayout from './layout/AdminLayout';
import MainLayout from './layout/MainLayout';
import PageNotFound from './pages/PageNotFound';
import BlogCategories from './pages/admin/blog-categories';
import AdminBlogs from './pages/admin/blogs';
import AddBlog from './pages/admin/blogs/addblog';
import EditBlog from './pages/admin/blogs/editblog';
import Brands from './pages/admin/brands';
import AddBrand from './pages/admin/brands/addBrand';
import EditBrand from './pages/admin/brands/editBrand';
import AdminHome from './pages/admin/home';
import AdminLogin from './pages/admin/login';
import ProductCategories from './pages/admin/product-categories';
import AddProductCategory from './pages/admin/product-categories/addProductCategory';
import EditProductCategory from './pages/admin/product-categories/editProductCategory';
import AdminProducts from './pages/admin/products';
import AddProduct from './pages/admin/products/addProduct';
import EditProduct from './pages/admin/products/editProduct';
import Slides from './pages/admin/slides';
import AddSlide from './pages/admin/slides/addSlide';
import EditSlide from './pages/admin/slides/editSlide';
import Users from './pages/admin/users';
import Login from './pages/auth/login';
import PhoneAuth from './pages/auth/loginPhone';
import LossPass from './pages/auth/losspass';
import Register from './pages/auth/register';
import Blogs from './pages/blog';
import BlogDetail from './pages/blog/blogdetail';
import Home from './pages/home';
import Cart from './pages/product/Cart';
import ProductDetail from './pages/product/ProductDetail';
import Profile from './pages/profile';
import Payment from './pages/profile/Payment';
import SearchPage from './pages/search';
import routes from './routes';
import Coupon from './pages/admin/coupon';
import AddCoupon from './pages/admin/coupon/addCoupon';
import EditCoupon from './pages/admin/coupon/editCoupon';

function App() {
  return (
    <div className='bg-[#f8f9fa] flex flex-col justify-between min-h-screen'>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={routes.HOME} element={<Home />} />
          <Route path={routes.PROFILE} element={<Profile />} />
          <Route path={routes.PAYMENT} element={<Payment />} />
          <Route path={routes.CART} element={<Cart />} />
          <Route path={routes.LOGIN} element={<Login />} />
          <Route path={routes.LOGIN_PHONE} element={<PhoneAuth />} />
          <Route path={routes.REGISTER} element={<Register />} />
          <Route path={routes.FORGOT} element={<LossPass />} />
          <Route path={routes.BLOGS} element={<Blogs />} />
          <Route path={routes.BLOG_DETAIL} element={<BlogDetail />} />
          <Route path={routes.PRODUCT_DETAIL} element={<ProductDetail />} />
          <Route path={routes.SEARCH} element={<SearchPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path={routes.ADMIN} element={<AdminHome />} />
          <Route path={routes.ADMIN_LOGIN} element={<AdminLogin />} />
          <Route path={routes.ADMIN_USERS} element={<Users />} />

          <Route path={routes.ADMIN_BLOGS} element={<AdminBlogs />} />
          <Route path={routes.ADMIN_BLOGS_ADDNEW} element={<AddBlog />} />
          <Route path={routes.ADMIN_BLOGS_EDIT} element={<EditBlog />} />
          <Route path={routes.ADMIN_BLOGCATEGORIES} element={<BlogCategories />} />
          <Route path={routes.ADMIN_BRANDS} element={<Brands />} />
          <Route path={routes.ADMIN_BRANDS_ADDNEW} element={<AddBrand />} />
          <Route path={routes.ADMIN_BRANDS_EDIT} element={<EditBrand />} />

          <Route path={routes.ADMIN_PRODUCTCATEGORIES} element={<ProductCategories />} />
          <Route path={routes.ADMIN_PRODUCTCATEGORIES_ADDNEW} element={<AddProductCategory />} />
          <Route path={routes.ADMIN_PRODUCTCATEGORIES_EDIT} element={<EditProductCategory />} />

          <Route path={routes.ADMIN_PRODUCTS} element={<AdminProducts />} />
          <Route path={routes.ADMIN_PRODUCTS_ADDNEW} element={<AddProduct />} />
          <Route path={routes.ADMIN_PRODUCTS_EDIT} element={<EditProduct />} />

          <Route path={routes.ADMIN_SLIDES} element={<Slides />} />
          <Route path={routes.ADMIN_SLIDES_ADDNEW} element={<AddSlide />} />
          <Route path={routes.ADMIN_SLIDES_EDIT} element={<EditSlide />} />

          <Route path={routes.ADMIN_COUPON} element={<Coupon />} />
          <Route path={routes.ADMIN_COUPON_ADDNEW} element={<AddCoupon />} />
          <Route path={routes.ADMIN_COUPON_EDIT} element={<EditCoupon />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
