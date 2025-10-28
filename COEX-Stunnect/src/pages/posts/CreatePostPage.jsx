import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
// import { FaPen } from "react-icons/fa"; // material/awesome icon
import "./CreatePostPage.css";

export const CreatePostPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate()
    const API_BASE = import.meta.env.VITE_API_BASE || "https://stunnect.hslidda.nl/api";

    const postTextRef = useRef(null);
    const fileInputRef = useRef(null);
    const [postText, setPostText] = useState("");
    const [imageFile, setImageFile] = useState(null); // NEW
    const [selectedTag, setSelectedTag] = useState(null);
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const maxChars = 2500;
    const { data: tags, loading, error } = useFetch(`${API_BASE}/post_tags`);

    const charsUsed = postText.length;
    const nearingLimit = charsUsed / maxChars >= 0.9;

    // // simple image validator (mime, ext, size and decode check)
    // const validateImageFile = (file) => {
    //     return new Promise((resolve) => {
    //         if (!file) return resolve(false);

    //         const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    //         const ALLOWED_EXT = ["jpg", "jpeg", "png", "gif", "webp"];
    //         const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

    //         if (!ALLOWED_MIME.includes(file.type)) return resolve(false);
    //         if (file.size > MAX_BYTES) return resolve(false);

    //         const nameParts = file.name.split(".");
    //         const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase() : "";
    //         if (!ALLOWED_EXT.includes(ext)) return resolve(false);

    //         const url = URL.createObjectURL(file);
    //         const img = new Image();
    //         img.onload = () => { URL.revokeObjectURL(url); resolve(true); };
    //         img.onerror = () => { URL.revokeObjectURL(url); resolve(false); };
    //         img.src = url;
    //     });
    // };

    const handleInput = (e) => {
        const el = postTextRef.current;
        const text = e.target.value;

        if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
        }

        if (text.length <= maxChars) setPostText(text);
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files?.[0] || null;
    //     setImageFile(file);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedText = postText;
        const tagId = selectedTag ? selectedTag.id : 1;

        if (!trimmedText) return;

        // validate image if present
        if (imageFile) {
            const ok = await validateImageFile(imageFile);
            if (!ok) {
                console.error("Invalid image file");
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            // build FormData (required)
            const formData = new FormData();
            formData.append("custom_user_id", user.id);
            formData.append("text_content", trimmedText);
            formData.append("tag_id", String(tagId));
            // append file under the field your API expects; using "image_content" to match previous code
            // if (imageFile) formData.append("image_content", null);

            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const response = await fetch(`${API_BASE}/post/create`, {
                method: "POST",
                headers, // do NOT set Content-Type when sending FormData
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to create post");

            // reset form
            setPostText("");
            setSelectedTag(null);
            setIsEditingTag(false);
            setSearchQuery("");
            setImageFile(null);
            if (postTextRef.current) postTextRef.current.style.height = "auto";
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error(err);
        }
        navigate("/account")
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

        <form onSubmit={handleSubmit} className="create-post-form" encType="multipart/form-data">
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

            {/* file upload for optional post image
            <div className="file-upload-wrapper">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                />
                {imageFile && <div className="file-name">{imageFile.name}</div>}
            </div> */}

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
