const routes = {
  HOME: "/",
  REGISTER: "/register",
  FORGOT: "/losspass",
  LOGIN: "/login",
  LOGIN_PHONE: "/login/phone",
  BLOG_CATEGORIES: "/blog-categories",
  BLOGS: "/blogs",
  BLOG_DETAIL: "/blog/:slug",
  PRODUCT_DETAIL: "/product/:slug",
  SEARCH: "/search/:name",

  PROFILE: "/profile",
  PROFILE_ORDER: "/profile/order",
  PAYMENT: "/profile/payment/:orderid",
  CART: "/cart",

  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_USERS: "/admin/users",
  ADMIN_BLOGS: "/admin/blogs",
  ADMIN_BLOGS_ADDNEW: "/admin/blogs/new",
  ADMIN_BLOGS_EDIT: "/admin/blogs/edit/:slug",

  ADMIN_BLOGCATEGORIES: "/admin/blog-categories",
  ADMIN_BLOGCATEGORIES_ADDNEW: "/admin/blog-categories/new",
  ADMIN_BLOGCATEGORIES_EDIT: "/admin/blog-categories/edit/:id",

  ADMIN_BRANDS: "/admin/brands",
  ADMIN_BRANDS_ADDNEW: "/admin/brands/new",
  ADMIN_BRANDS_EDIT: "/admin/brands/edit/:id",

  ADMIN_PRODUCTCATEGORIES: "/admin/product-categories",
  ADMIN_PRODUCTCATEGORIES_ADDNEW: "/admin/product-categories/new",
  ADMIN_PRODUCTCATEGORIES_EDIT: "/admin/product-categories/edit/:id",

  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCTS_ADDNEW: "/admin/products/new",
  ADMIN_PRODUCTS_EDIT: "/admin/products/edit/:slug",

  ADMIN_COUPON: "/admin/coupon",
  ADMIN_COUPON_ADDNEW: "/admin/coupon/new",
  ADMIN_COUPON_EDIT: "/admin/coupon/edit/:id",

  ADMIN_SETTING: "/admin/setting",
  ADMIN_SETTING_MENU: "/admin/setting/menu",
  ADMIN_SETTING_FOOTER: "/admin/setting/footer",
  ADMIN_SLIDES: "/admin/setting/slides",
  ADMIN_SLIDES_ADDNEW: "/admin/setting/slides/new",
  ADMIN_SLIDES_EDIT: "/admin/setting/slides/edit/:slug",
};

export default routes;
