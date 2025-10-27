import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
// import { FaPen } from "react-icons/fa"; // material/awesome icon
import "./CreatePostPage.css";

export const CreatePostPage = () => {
    const { user } = useAuth();
    const postTextRef = useRef(null);
    const [postText, setPostText] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate()

    const maxChars = 2500;
    const { data: tags, loading, error } = useFetch("http://localhost:5123/api/post_tags");

    const charsUsed = postText.length;
    const nearingLimit = charsUsed / maxChars >= 0.9;


    const handleInput = (e) => {
        const el = postTextRef.current;
        const text = e.target.value;

        if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        }

        if (text.length <= maxChars) setPostText(text);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedText = postText;
        const tagId = selectedTag ? selectedTag.id : 1;

        if (!trimmedText) return;

        try {
            const token = localStorage.getItem("token"); 
            const response = await fetch("http://localhost:5123/api/posts", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    custom_user_id: user.id, 
                    text_content: trimmedText, 
                    tag_id: tagId, 
                    image_content: ""
                }),
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

    // Filter tags by search query
    const filteredTags = tags
        ? tags.filter((tag) =>
            tag.tag_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];








    
    return (
        <main className="create-post-container">
        <h2>Create a New Post</h2>

        <form onSubmit={handleSubmit} className="create-post-form">
            <label htmlFor="posttext" className="visually-hidden">
            Post text
            </label>

            <textarea
            id="posttext"
            name="posttext"
            placeholder="What's on your mind?"
            ref={postTextRef}
            onInput={handleInput}
            value={postText}
            rows={1}
            className="post-input"
            />

            <div className={`char-counter ${nearingLimit ? "warning" : ""}`}>
            {charsUsed} / {maxChars}
            </div>

            {/* --- Tag selector/pill --- */}
            <div className="tag-section">
            {selectedTag && !isEditingTag ? (
                <div className="selected-tag-pill">
                <span className="tag-name">#{selectedTag.tag_name}</span>
                <button
                    type="button"
                    className="edit-tag-btn"
                    onClick={() => setIsEditingTag(true)}
                >
                    {/* <FaPen /> */}edit
                </button>
                </div>
            ) : (
                <AnimatePresence>
                <motion.div
                    className="tag-dropdown-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <input
                    type="text"
                    placeholder="Search or select a tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="tag-search"
                    disabled={loading}
                    />
                    <div className="tag-options">
                    {loading && <div className="tag-option">Loading...</div>}
                    {error && <div className="tag-option">Error loading tags</div>}
                    {!loading &&
                        !error &&
                        filteredTags.map((tag) => (
                        <div
                            key={tag.id}
                            className="tag-option"
                            onClick={() => {
                            setSelectedTag(tag);
                            setIsEditingTag(false);
                            setSearchQuery("");
                            }}
                        >
                            #{tag.tag_name}
                        </div>
                        ))}
                    {!loading && !error && filteredTags.length === 0 && (
                        <div className="tag-option disabled">No tags found</div>
                    )}
                    </div>
                </motion.div>
                </AnimatePresence>
            )}
            </div>

            <div className="post-options">
            <button
                type="submit"
                className={`submit-btn ${!postText.trim() ? "disabled" : "active"}`}
                disabled={!postText.trim()}
            >
                Post
            </button>
            </div>
        </form>
        </main>
    );
    };
