import defaultProfilePic from "../../assets/basic_pfp.webp";
import { useFetch } from "../../hooks/useFetch";
import { PostCard } from "../../components";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Accountpages.css";

export const AccountPage = () => {
    const { user: user } = useAuth();
    const API_BASE = import.meta.env.VITE_API_BASE || "https://stunnect.hslidda.nl/api";


    const { data: userPosts, userPostsLoading, userPostsError } = useFetch(`${API_BASE}/user_posts/${user.id}`);
    const { data: userFriends, friendsLoading, friendsError } = useFetch(`${API_BASE}/users/${user.id}`);


    // split friends into accepted / pending
    const { acceptedFriends, pendingFriends } = useMemo(() => {
        if (!userFriends || !Array.isArray(userFriends)) {
            return { acceptedFriends: [], pendingFriends: [] };
        }

        const accepted = [];
        const pending = [];

        for (const f of userFriends) {
            const status = (f.friend_status || "").toString().toLowerCase();
            if (status === "accepted") accepted.push(f);
            else if (status === "pending") pending.push(f);
        }

        return { acceptedFriends: accepted, pendingFriends: pending };
    }, [userFriends]);


    const sortedPosts = useMemo(() => {
        if (!userPosts) return [];
        return [...userPosts].sort((a, b) => b.id - a.id);
    }, [userPosts]);

    return (
        <main className="account-page">
        {user && (
            <>
            <section className="profile-header">
                <div className="header-top">
                    <div className="left-section">
                        <img
                        src={user.profile_image_base64 ? user.profile_image_base64 : defaultProfilePic}
                        alt="user profile"
                        className="profile-pic"
                        />
                        <div className="info">
                            <h2 className="username">{user.username}</h2>
                            <p className="study">{user.follows_study}</p>
                        </div>
                    </div>

                    <div className="stats">
                        <div className="stat">
                            <span className="stat-number">{acceptedFriends.length}</span>
                            <span className="stat-label">Friends</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{pendingFriends.length}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                </div>

                <div className="edit-container">
                    <button className="edit-btn">Edit profile</button>
                </div>
            </section>

            <section className="profile-posts">
                <h2>Your Posts</h2>

                {userPostsLoading && <p>Loading posts...</p>}
                {userPostsError && <p>{userPostsError}</p>}

                {userPosts && userPosts.length === 0 && (
                <div className="no-posts">
                    <p>Create your first post</p>
                    <Link className="submit-btn active" to={"/posts/create"}>
                    Create Post
                    </Link>
                </div>
                )}

                {sortedPosts.map((post) => (
                <PostCard post={post} key={post.id} />
                ))}
            </section>
            </>
        )}
        </main>
    );
};
