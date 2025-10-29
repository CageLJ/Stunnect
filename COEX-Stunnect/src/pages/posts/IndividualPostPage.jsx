import { useParams, Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Add this import
import profilePic from "../../assets/basic_pfp.webp";
import "./IndividualPostPage.css";

export const IndividualPostPage = () => {
    const { user } = useAuth(); // Add this line
    const params = useParams();
    const API_BASE = import.meta.env.VITE_API_BASE || "https://stunnect.hslidda.nl/api";

    const { data: post, loading: loadingPost, error: errorPost } = useFetch(
        `${API_BASE}/post/${params.id}`
    );
    const {
        data: fetchedReactions,
        loading: loadingReactions,
        error: errorReactions,
    } = useFetch(`${API_BASE}/post_comments/${params.id}`);

    const [reactions, setReactions] = useState([]);
    const [responseText, setResponseText] = useState("");
    const responseTextRef = useRef(null);
    const maxChars = 2500;
    
    // Once fetched, store sorted reactions
    useEffect(() => {
        if (fetchedReactions) {
        const sorted = [...fetchedReactions].sort((a, b) => b.comment_id - a.comment_id);
        setReactions(sorted);
        }
    }, [fetchedReactions]);

    const handleInput = (e) => {
        const el = responseTextRef.current;
        const text = e.target.value;

        if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        }

        if (text.length <= maxChars) setResponseText(text);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedText = responseText.trim();

        if (!trimmedText || !user) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE}/post_comment/create`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    custom_user_id: user.id,
                    text_content: trimmedText,
                    post_id: Number(params.id),
                }),
            });

            if (!response.ok) throw new Error("Failed to create reaction");

            const newReaction = await response.json();

            setReactions((prev) => [newReaction, ...prev]);

            setResponseText("");
            if (responseTextRef.current) responseTextRef.current.style.height = "auto";
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="post-page">
        {loadingPost && <p>Loading post...</p>}
        {errorPost && <p>{errorPost}</p>}

        {post && (
            <>
            <div className="post-card">
                <div className="post-header">
                <Link to={`/user/${post.user_id}`} className="post-user">
                    <img 
                        src={post.profile_image ? post.profile_image : profilePic} 
                        alt="user profile picture" 
                        className="post-user-img" 
                    />
                    <span>{post.username}</span>
                </Link>
                <span className="post-tag">#{post.tag_name}</span>
                </div>

                <p className="post-text">{post.text_content}</p>
            </div>

            <div className="reaction-form-section">
                <form onSubmit={handleSubmit} className="reaction-form">
                <textarea
                    id="responsetext"
                    name="responsetext"
                    placeholder="Write a response..."
                    ref={responseTextRef}
                    onInput={handleInput}
                    value={responseText}
                    rows={1}
                    className="reaction-input"
                />
                <button
                    type="submit"
                    className={`reaction-submit-btn ${
                    !responseText.trim() ? "disabled" : "active"
                    }`}
                    disabled={!responseText.trim()}
                >
                    Post
                </button>
                </form>
            </div>

            <div className="reaction-list">
                {loadingReactions && <p>Loading reactions...</p>}
                {errorReactions && <p>{errorReactions}</p>}
                {reactions.length === 0 ? (
                <p className="no-reactions">No reactions yet. Be the first!</p>
                ) : (
                reactions.map((reaction) => (
                    <div key={reaction.id} className="reaction-item">
                    <Link to={`/user/${reaction.custom_user_id}`}>
                        <div className="reaction-user">
                            <img
                            src={reaction.profile_image ? reaction.profile_image : profilePic}
                            alt="user profile picture"
                            className="reaction-user-img"
                            />
                            <span className="reaction-username">
                            {reaction.username}
                            </span>
                        </div>
                    </Link>
                    <p className="reaction-text">{reaction.text_content}</p>
                    </div>
                ))
                )}
            </div>
            </>
        )}
        </main>
    );
};
