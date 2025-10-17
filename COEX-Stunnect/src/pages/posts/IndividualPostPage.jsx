import { useParams, Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useState, useRef, useEffect } from "react";
import profilePic from "../../assets/basic_pfp.webp";
import "./IndividualPostPage.css";

export const IndividualPostPage = () => {
    const params = useParams();
    const { data: post, loading: loadingPost, error: errorPost } = useFetch(
        `http://localhost:8000/posts/${params.id}`
    );
    const {
        data: fetchedReactions,
        loading: loadingReactions,
        error: errorReactions,
    } = useFetch(`http://localhost:8000/reactions?post_id=${params.id}`);

    const [reactions, setReactions] = useState([]);
    const [responseText, setResponseText] = useState("");
    const responseTextRef = useRef(null);
    const maxChars = 2500;
    
    // Once fetched, store sorted reactions
    useEffect(() => {
        if (fetchedReactions) {
        const sorted = [...fetchedReactions].sort((a, b) => b.id - a.id);
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

        if (!trimmedText) return;

        try {
        const response = await fetch("http://localhost:8000/reactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            custom_user_id: 1,
            text_content: trimmedText,
            post_id: Number(params.id),
            }),
        });

        if (!response.ok) throw new Error("Failed to create reaction");

        const newReaction = await response.json();

        // Add the new reaction at the top immediately
        setReactions((prev) => [newReaction, ...prev]);

        // Reset text area
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
                <Link to={`/user/${post.custom_user_id}`} className="post-user">
                    <img src={profilePic} alt="user" className="post-user-img" />
                    <span>User {post.custom_user_id}</span>
                </Link>
                <span className="post-tag">#{post.tag_id}</span>
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
                    <div className="reaction-user">
                        <img
                        src={profilePic}
                        alt="user"
                        className="reaction-user-img"
                        />
                        <span className="reaction-username">
                        User {reaction.custom_user_id}
                        </span>
                    </div>
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
