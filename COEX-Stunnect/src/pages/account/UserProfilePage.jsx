import defaultProfilePic from "../../assets/basic_pfp.webp";
import { useFetch } from "../../hooks/useFetch";
import { PostCard } from "../../components";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Accountpages.css";

export const UserProfilePage = () => {
    const { user: currentUser } = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE || "https://stunnect.hslidda.nl/api";


    useEffect(() => {
        if (currentUser.id == params.id) {
            navigate("/account");
        }
    }, [currentUser, params.id]);

    // api server
    const { data: userEntity, userLoading, userError } = useFetch(`${API_BASE}/user/${params.id}`);
    const { data: userPosts, userPostsLoading, userPostsError } = useFetch(`${API_BASE}/user_posts/${params.id}`);
    const { data: userFriends, friendsLoading, friendsError } = useFetch(`${API_BASE}/users/${params.id}`);

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

    const handleBefriend = (id) => async (e) => {  // Changed to return a function
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); 
            const response = await fetch(`${API_BASE}/user_friend/create`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    user_id: currentUser.id,  
                    friend_id: id, 
                    friend_status: "Pending"
                }),
            });

            if (!response.ok) throw new Error("Failed to send friend request");
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <main className="account-page">
            {userLoading && <p>Loading user...</p>}
            {userError && <p>{userError}</p>}
            {userEntity && (
                <>
                    <section className="profile-header">
                        <div className="header-top">
                            <div className="left-section">
                                <img
                                src={userEntity.user.profile_image_base64 ? userEntity.user.profile_image_base64 : defaultProfilePic}
                                alt="user profile"
                                className="profile-pic"
                                />
                                <div className="info">
                                    <h2 className="username">{userEntity.user.username}</h2>
                                    <p className="study">{userEntity.user.follows_study}</p>
                                </div>
                            </div>

                            <div className="stats">
                                <div className="stat">
                                    <span className="stat-number">{acceptedFriends.length}</span>
                                    <span className="stat-label">Friends</span>
                                </div>
                            </div>
                        </div>

                        <div className="edit-container">
                            <button
                                className="edit-btn"
                                onClick={handleBefriend(Number(params.id))}
                                disabled={
                                    userEntity?.friend_status === "Pending" ||
                                    userEntity?.friend_status === "Accepted"
                                }
                            >
                                {userEntity?.friend_status === "Accepted"
                                    ? "Friends"
                                    : userEntity?.friend_status === "Pending"
                                    ? "Pending"
                                    : "Add Friend"}
                            </button>
                        </div>
                    </section>
                    
                    <section className="profile-posts">
                        <h2>{user.username}'s posts</h2>
        
                        {userPostsLoading && <p>Loading posts...</p>}
                        {userPostsError && <p>{userPostsError}</p>}
        
                        {userPosts && userPosts.length === 0 && (
                        <div className="no-posts">
                            <p>this user hasn't posted anything yet</p>
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
    )
}
