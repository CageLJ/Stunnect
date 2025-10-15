import { useParams, Link } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch";
import { useState, useRef } from "react";

export const IndividualPostPage = () => {
    const params = useParams();
    const [url, setUrl] = useState(`http://localhost:8000/posts/${params.id}`);
    const { data: post, loading, error} = useFetch(url);
    const responseTextRef = useRef(null);
    const [responseText, setResponseText] = useState("");
    // const [responses, setResponses] = useState([]);

    const maxChars = 2500;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedText = responseText.trim();

        if (!trimmedText) return;

        try {
        const response = await fetch("http://localhost:8000/reactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({custom_user_id:1, text_content: trimmedText, post_id: params.id, image_content:"" }),
        });

        if (!response.ok) throw new Error("Failed to create post");

        setPostText("");
        setSelectedTag(null);
        setIsEditingTag(false);
        setSearchQuery("");
        if (postTextRef.current) postTextRef.current.style.height = "auto";
        } catch (err) {
        console.error(err);
        }
        navigate("/posts")
    };

    const handleInput = (e) => {
        const el = responseTextRef.current;
        const text = e.target.value;

        if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        }

        if (text.length <= maxChars) setResponseText(text);
    };



    return (
        <main>
            {loading && <p>Loading posts...</p>}
            {error && <p>{error}</p>}
            {post && 
            <>
                <div className="postContainer">
                    <div className="infoSection">
                        <Link to={`/user/${post.custom_user_id}`} className="Postuser">
                            User id:{post.custom_user_id}
                        </Link>
                        <p className="postTag">Tag id: {post.tag_id}</p>
                    </div>
                    <div>
                        <p>{post.text_content}</p>
                    </div>
                </div>
                <div className="reacton-form">
                    {/* input for post reaction */}
                    <form onSubmit={handleSubmit} className="reaction-form">
                        <textarea
                            id="responsetext"
                            name="responsetext"
                            placeholder="What's on your mind?"
                            ref={responseTextRef}
                            onInput={handleInput}
                            value={responseText}
                            rows={1}
                            className="post-input"
                        />
                        <button
                            type="submit"
                            className={`submit-btn ${!responseText.trim() ? "disabled" : "active"}`}
                            disabled={!responseText.trim()}
                        >
                            Post
                        </button>
                    </form>
                </div>
                <div className="reaction-list">
                    {data.responses.length === 0 ? (
                        <p>No reactions yet. Be the first to react!</p>
                    ) : (data.responses.map((response) => (
                        <div key={response.id} className="reaction-item">
                            <p>{response}</p>
                        </div>
                    )))}
                </div>
            </>  
            }
        </main>
    )
}
