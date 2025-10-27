import { PostCard } from "../../components";
import { useFetch } from "../../hooks/useFetch";
import { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";

import "./PostsPage.css";

export const PostsPage = () => {
    const { user } = useAuth();
    const [url, setUrl] = useState("http://localhost:5123/api/posts");
    const { data: posts, loading, error } = useFetch(url);

    // Determine active tab
    const isAllPosts = url === "http://localhost:5123/api/posts";
    const isFriends = url.includes("/api/friend_posts/");

    // Sort newest first (highest ID)
    const sortedPosts = useMemo(() => {
        if (!posts) return [];
        return [...posts].sort((a, b) => b.id - a.id);
    }, [posts]);

    return (
        <>
            <header className="posts-filter-header">
                <nav className="posts-tabs">
                    <button
                    className={`tab ${url === "http://localhost:5123/api/posts" ? "active" : ""}`}
                    onClick={() => setUrl("http://localhost:5123/api/posts")}
                    >
                    All Posts
                    </button>
                    <button
                    className={`tab ${url.includes("/api/friend_posts/") ? "active" : ""}`}
                    onClick={() => setUrl(`http://localhost:5123/api/friend_posts/${user.id}`)}
                    >
                    Friends
                    </button>

                    {/* The blue underline element */}
                    <div
                    className="tab-underline"
                    style={{
                        transform:
                        url === "http://localhost:5123/api/posts"
                            ? "translateX(0%)"
                            : "translateX(100%)",
                    }}
                    ></div>
                </nav>
            </header>

            <main className="posts-page">
                {loading && <p>Loading posts...</p>}
                {error && <p>{error}</p>}

                {sortedPosts.map((post) => (
                    <PostCard post={post} key={post.id} />
                ))}
            </main>
        </>
    );
};
