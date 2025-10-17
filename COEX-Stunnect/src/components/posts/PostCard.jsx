import { Link, useNavigate } from "react-router-dom";
import "./PostCard.css";
import profilePic from "../../assets/basic_pfp.webp";

export const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent click if user clicked a link inside the card
    if (e.target.closest("a")) return;
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-header">
        <Link to={`/user/${post.custom_user_id}`} className="post-user">
          <img src={profilePic} alt="user" className="post-user-img" />
          <span>User {post.custom_user_id}</span>
        </Link>
        <span className="post-tag">#{post.tag_id}</span>
      </div>

      <div className="post-text">
        <p>{post.text_content}</p>
      </div>
    </div>
  );
};
