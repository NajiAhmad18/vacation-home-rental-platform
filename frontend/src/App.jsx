import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { MapProvider } from "../provider/GoogleMapsProvider";
import { Toaster } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import HomePage from "./pages/HomePage";
import BookHome from "./pages/BookHome";
import Wishlist from "./pages/whislistPage";
import ProfilePage from "./pages/user/ProfilePage.jsx";
import Review from "./components/user/Review";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSucces.jsx";

import AdminDashboard from "./pages/adminDashboard";
import RoomOwnerDashboard from "./pages/RoomOwnerDashboard";

import ExplorePage from "./pages/ExplorePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotificationsPage from "./pages/NotificationsPage";

import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";

import LoadingSpinner from "./components/LoadingSpinner.jsx";
import NotFound from "./components/NotFound .jsx";

import { useAuthStore } from "./stores/useAuthStore.js";
import UserLayout from "./components/user/UserLayout .jsx";
import PropertyDetailPage from "./pages/propertyDetailsPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PublicRoute from "./components/auth/PublicRoute.jsx";

// ✅ Read publishable key from Vite env
const pk = (import.meta.env.VITE_STRIPE_PUBLIC_KEY || "").trim();

// ✅ Helpful guard (prevents the "match" error if key is missing/invalid)
if (!pk || !/^pk_(test|live)_/.test(pk)) {
  console.error("Missing/invalid VITE_STRIPE_PUBLIC_KEY. Check frontend/.env and restart dev server.");
}

// ✅ Create once at module scope
const stripePromise = pk && /^pk_(test|live)_/.test(pk) ? loadStripe(pk) : null;

function App() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const getProfile = useAuthStore((state) => state.getProfile);

  useEffect(() => {
    getProfile(); // ignore errors
  }, [getProfile]);

  useEffect(() => {
    console.log("user : ", user);
  }, [user]);

  if (loading || user === undefined) return <LoadingSpinner />;

  return (
    <>
      <MapProvider>
         <Elements stripe={stripePromise}>
        <Routes>
          {/* ================= USER ROUTES (With Navbar) ================= */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/home/:id" element={<PropertyDetailPage />} />
            <Route
              path="/book-home/:id"
              element={
                <ProtectedRoute>
                  <BookHome />
                </ProtectedRoute>
              }
            />

            {/* 🔒 Protected User Routes */}
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/:bookingId"
              element={
                <ProtectedRoute>
                  <Review />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ================= AUTH ROUTES ================= */}
          <Route
            path="/auth/sign-in"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/sign-up"
            element={
              <PublicRoute>
                <Signup type="user" />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/owner/sign-up"
            element={
              <PublicRoute>
                <Signup type="owner" />
              </PublicRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= OWNER ROUTES ================= */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute role="roomOwner">
                <RoomOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 ROUTE ================= */}
          <Route path="*" element={<NotFound />} />
           <Route path="/user/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
        </Routes>
        </Elements>
      </MapProvider>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
