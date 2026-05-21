import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Toast from './components/Common/Toast';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import QuizPage from './pages/QuizPage';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminCourses from './pages/AdminCourses';
import AdminQuizzes from './pages/AdminQuizzes';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <Toast />
            <Routes>
              {/* Public Routes with Navbar/Footer */}
              <Route
                path="/*"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/courses" element={<CourseList />} />
                        <Route path="/courses/:id" element={<CourseDetail />} />
                        <Route path="/lessons/:lessonId" element={<LessonView />} />
                        <Route path="/quiz/lesson/:lessonId" element={<QuizPage />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route
                          path="/checkout"
                          element={
                            <ProtectedRoute>
                              <Checkout />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <UserProfile />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />

              {/* Admin Routes (No Navbar/Footer) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quizzes"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminQuizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
