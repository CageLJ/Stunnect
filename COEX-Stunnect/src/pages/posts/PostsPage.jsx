import { PostCard } from "../../components";
import { useFetch } from "../../hooks/useFetch";
import { useState, useEffect, useMemo } from "react";
import "./PostsPage.css";

export const PostsPage = () => {
    const [url, setUrl] = useState("http://localhost:8000/posts");
    const { data: posts, loading, error } = useFetch(url);

    // Sort newest first (highest ID)
    const sortedPosts = useMemo(() => {
        if (!posts) return [];
        return [...posts].sort((a, b) => b.id - a.id);
    }, [posts]);

    return (
        <main className="posts-page">
        {loading && <p>Loading posts...</p>}
        {error && <p>{error}</p>}

        {sortedPosts.map((post) => (
            <PostCard post={post} key={post.id} />
        ))}
        </main>
    );
};
