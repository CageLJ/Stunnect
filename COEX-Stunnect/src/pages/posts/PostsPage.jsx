import { PostCard } from "../../components";
import { useFetch } from "../../hooks/useFetch";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Add this import
import "./PostsPage.css";

export const PostsPage = () => {
    const { user } = useAuth(); // Add this line
    const [url, setUrl] = useState("http://localhost:8000/api/posts");
    const { data: posts, loading, error } = useFetch(url);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

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
