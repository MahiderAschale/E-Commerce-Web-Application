import { Routes, Route } from "react-router-dom"
import HomePage from './pages/homePage';
import ProductList from './pages/productList';
import ProductDetail from './pages/productDetail';
import CartPage from './pages/cartPage';
import CheckoutPage from './pages/checkout';
import LoginPage from "./pages/login";
import AccountPage from './pages/account'
import ProfilePage from "./pages/Profile";
import ProtectedRoute from "./component/ProtectedRoute";
import PaymentSuccessPage from "./pages/payment-success";
import OrderDetailPage from "./pages/order-detail";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import './App.css'
import AddressPage from "./pages/AddressPage";


export default function App() {
return(
     <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductList/>}/>
      <Route path="/product/:id" element={<ProductDetail/>}/>
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={ <ProtectedRoute> <CheckoutPage /> </ProtectedRoute> } /><Route path="/account" element={<AccountPage/>}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element= {<ProtectedRoute> <ProfilePage/></ProtectedRoute>}/>
      <Route path="/address" element={ <ProtectedRoute> <AddressPage /> </ProtectedRoute> } /> 
      <Route path="/payment-success"element={<PaymentSuccessPage />}/>
      <Route path="/orders"element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}/>
      <Route path="/orders/:id" element={<ProtectedRoute>  <OrderDetailPage /></ProtectedRoute> }/>
      <Route path="/admin/dashboard"element={<ProtectedRoute><AdminDashboard /></ProtectedRoute> }/>
      <Route
  path="/admin/products"
  element={
    <ProtectedRoute>
      <AdminProducts />
    </ProtectedRoute>
  }
/>
      </Routes>

     </>
);
}

