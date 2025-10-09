import { Routes, Route, Navigate } from "react-router-dom";
import { AccountPage, UserProfilePage, IndividualPostPage, PostsPage, CreatePostPage, LoginPage, RegisterPage, ChatPage, NotFoundPage } from "../pages";

export const AllRoutes = () => {
    // TODO: implement conditional rendering for account page so users can just share the link to their profile (use the navigate)
    const loggedIN = true

    return (
    <>
        <Routes>
            <Route path="/" element={loggedIN ? <Navigate to="/posts" replace /> : <Navigate to="/login"/>} />
            <Route path="/posts" element={loggedIN ? <PostsPage /> : <Navigate to="/login"/>} />
            <Route path="posts/create" element={loggedIN ? <CreatePostPage />: <Navigate to="/login"/>} />
            <Route path="posts/:id" element={loggedIN ? <IndividualPostPage />: <Navigate to="/login"/>} />
            <Route path="/account" element={loggedIN ?<AccountPage />: <Navigate to="/login"/>} />
            <Route path="/user/:id" element={loggedIN ?<UserProfilePage />: <Navigate to="/login"/>} />
            <Route path="/chat" element={loggedIN ?<ChatPage />: <Navigate to="/login"/>} />
            <Route path="*" element={loggedIN ?<NotFoundPage />: <Navigate to="/login"/>} />
            <Route path="/login" element={loggedIN ?<LoginPage />: <Navigate to="/"/>} />
            <Route path="/register" element={loggedIN ?<RegisterPage />: <Navigate to="/"/>} />
        </Routes>
    </>
    )
}

