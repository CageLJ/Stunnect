import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AccountPage, UserProfilePage, IndividualPostPage, PostsPage, CreatePostPage, LoginPage, RegisterPage, ChatPage, NotFoundPage } from "../pages";

export const AllRoutes = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null; // or a spinner

    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/posts" replace /> : <Navigate to="/login" />} />
            <Route path="/posts" element={isAuthenticated ? <PostsPage /> : <Navigate to="/login" />} />
            <Route path="/posts/create" element={isAuthenticated ? <CreatePostPage /> : <Navigate to="/login" />} />
            <Route path="/posts/:id" element={isAuthenticated ? <IndividualPostPage /> : <Navigate to="/login" />} />
            <Route path="/account" element={isAuthenticated ? <AccountPage /> : <Navigate to="/login" />} />
            <Route path="/user/:id" element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/login" />} />
            <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/posts" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/posts" />} />
            <Route path="*" element={isAuthenticated ? <NotFoundPage /> : <Navigate to="/login" />} />
        </Routes>
    );
};

