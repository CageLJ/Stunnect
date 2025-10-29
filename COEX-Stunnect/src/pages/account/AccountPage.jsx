import { useState, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { PostCard } from "../../components";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import defaultProfilePic from "../../assets/basic_pfp.webp";
import "./Accountpages.css";

export const AccountPage = () => {
    const { user } = useAuth();
    const API_BASE = import.meta.env.VITE_API_BASE || "https://stunnect.hslidda.nl/api";
    const [activePanel, setActivePanel] = useState(null); // "friends" | "pending" | null

    const { data: userPosts, userPostsLoading, userPostsError } = useFetch(`${API_BASE}/user_posts/${user.id}`);
    const { data: userFriends } = useFetch(`${API_BASE}/user_friends/${user.id}`);

    // Separate accepted and pending
    const { acceptedFriends, pendingFriends } = useMemo(() => {
        if (!userFriends || !Array.isArray(userFriends)) {
            return { acceptedFriends: [], pendingFriends: [] };
        }

        const accepted = [];
        const pending = [];

        for (const f of userFriends) {
            const status = (f.friend_status || "").toLowerCase();
            if (status === "accepted") accepted.push(f);
            else if (status === "pending") pending.push(f);
        }

        return { acceptedFriends: accepted, pendingFriends: pending };
    }, [userFriends]);

    const sortedPosts = useMemo(() => {
        if (!userPosts) return [];
        return [...userPosts].sort((a, b) => b.id - a.id);
    }, [userPosts]);


    const handleFriendAccept = (friendId) => async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/user_friend/update/${friendId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    friend_id: user.id,
                    friend_status: "Accepted"
                })
            });

            if (!response.ok) throw new Error("Failed to accept friend request");
            // Optionally refresh friends list here
        } catch (err) {
            console.error(err);
        }
    };

    const handleFriendDecline = (friendId) => async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/user_friend/${friendId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to decline friend request");
            // Optionally refresh friends list here
        } catch (err) {
            console.error(err);
        }
    };




    return (
        <main className="account-page">
            {user && (
                <>
                    {/* Profile Header */}
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
                                <div
                                    className="stat clickable"
                                    onClick={() => setActivePanel("friends")}
                                >
                                    <span className="stat-number">{acceptedFriends.length}</span>
                                    <span className="stat-label">Friends</span>
                                </div>
                                <div
                                    className="stat clickable"
                                    onClick={() => setActivePanel("pending")}
                                >
                                    <span className="stat-number">{pendingFriends.length}</span>
                                    <span className="stat-label">Pending</span>
                                </div>
                            </div>
                        </div>

                        <div className="edit-container">
                            <button className="edit-btn">Edit profile</button>
                        </div>
                    </section>

                    {/* Posts Section */}
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

                    {/* Slide-In Overlay */}
                    <div className={`friends-overlay ${activePanel ? "show" : ""}`}>
                        <div className="friends-header">
                            <button className="back-btn" onClick={() => setActivePanel(null)}>
                                ←
                            </button>
                            <h2>
                                {activePanel === "friends" ? "Your Friends" : "Pending Requests"}
                            </h2>
                        </div>

                        <div className="friends-list">
                            {(activePanel === "friends" ? acceptedFriends : pendingFriends).map(
                                (f) => (
                                    <div key={f.id} className="friend-item">
                                        <Link to={`/user/${f.user.id}`} className="friend-info">
                                            <img
                                                src={
                                                    f.profile_image_base64
                                                        ? f.user.profile_image_base64
                                                        : defaultProfilePic
                                                }
                                                alt={f.user.username}
                                                className="friend-pic"
                                            />
                                            <span className="friend-username">{f.user.username}</span>
                                        </Link>
                                        <div className="friend-actions">
                                            <button 
                                                className="decline" 
                                                onClick={handleFriendDecline(f.row_id)}
                                            >
                                                ✕
                                            </button>
                                            {activePanel === "pending" && (
                                                <button 
                                                    className="accept" 
                                                    onClick={handleFriendAccept(f.user.id)}
                                                >
                                                ✓
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};
