import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes, Switch, Navigate } from "react-router-dom";
import Home from './components/home';
import Users from './components/users';
import EditProfile from './components/editprofile';
import Collections from './components/collections';
import Product from './components/product';
import CreateCollection from './components/createcollection';
import ViewCollection from './components/viewcollection';
import Header from './components/global/header';
import Footer from './components/global/footer';
import Login from './components/login';
import { AuthProvider } from "./auth/auth";
import PrivateRoute from './PrivateRoute';

const routing = (
  <AuthProvider>
    <Router>
      <div>
        {/* {
          window.location.pathname != '/login' &&  <Header />
        } */}
        <Header />
        <Routes>

          {<Route exact path='/' element={<PrivateRoute />}>
            <Route exact path='/' element={<Home />} />
            {/* <Route exact path="/" render={() => <Navigate to="/home" />} /> */}
            <Route exact path='/home' element={<Home />} />
            <Route exact="true" path="/collections" component={Collections} element={<Collections />} />
            <Route path="/users" component={Users} element={<Users />} />
            <Route path="/users/:userId" component={EditProfile} element={<EditProfile />} />
            <Route path="/product" component={Product} element={<Product />} />
            <Route path="/createcollection" component={CreateCollection} element={<CreateCollection />} />
            <Route path="/viewcollection" component={ViewCollection} element={<ViewCollection />} />
          </Route>}
         
          {/* <PrivateRoute exact="true" path="/" component={Home} element={<Home />} /> */}
          
          <Route exact="true" path="/login" component={Login} element={<Login />} />
          

          {/* <Route path="/contact" component={Contact} />
        <Route component={Notfound} /> */}

        </Routes>
        {/* {
          window.location.pathname != '/login' &&  <Footer />
        } */}
        <Footer />
      </div>
    </Router>
  </AuthProvider>
);

function App() {
  return routing;
}

export default App;
