import { Routes, Route, Navigate } from "react-router-dom";
import { AccountPage, UserProfilePage, IndividualPostPage, PostsPage, CreatePostPage, LoginPage, RegisterPage, ChatPage, NotFoundPage } from "../pages";

export const AllRoutes = () => {
    // TODO: implement redirection to /posts if user goes to /
    // TODO: implement conditional rendering for account page so users can just share the link to their profile (use the navigate)
    // TODO: redirect to /login if user is not logged in

    return (
    <>
        <Routes>
            <Route path="/" element={<PostsPage />} />
            <Route path="posts/create" element={<CreatePostPage />} />
            <Route path="posts/:id" element={<IndividualPostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/user/:id" element={<UserProfilePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </>
    )
}