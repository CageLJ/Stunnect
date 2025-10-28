import { PostCard } from "../../components";
import { useFetch } from "../../hooks/useFetch";

import { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";

import "./PostsPage.css";

export const PostsPage = () => {
    const { user } = useAuth();
    const API_BASE = import.meta.env.VITE_API_BASE || "https://stunnect.hslidda.nl/api";
    const [url, setUrl] = useState(`${API_BASE}/posts`);
    const { data: posts, loading, error } = useFetch(url);

    // Determine active tab
    const isAllPosts = url === `${API_BASE}/posts`;
    const isFriends = url.includes("/friend_posts/");


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
                    className={`tab ${url === `${API_BASE}/posts` ? "active" : ""}`}
                    onClick={() => setUrl(`${API_BASE}/posts`)}
                    >
                    All Posts
                    </button>
                    <button
                    className={`tab ${url.includes("/friend_posts/") ? "active" : ""}`}
                    onClick={() => setUrl(`${API_BASE}/friend_posts/${user?.id ?? 1}`)}
                    >
                    Friends
                    </button>

                    {/* The blue underline element */}
                    <div
                    className="tab-underline"
                    style={{
                        transform:
                        url === `${API_BASE}/posts`
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
