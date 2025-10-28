import { Link, useNavigate } from "react-router-dom";
import "./PostCard.css";

export const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.closest("a")) return;
    navigate(`/posts/${post.post_id}`);
  };

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-header">
        <Link to={`/user/${post.user_id}`} className="post-user">
          <img src={post.profile_image} alt="user profile picture" className="post-user-img" />
          <span>{post.username}</span>
        </Link>
        <span className="post-tag">#{post.tag_name}</span>
      </div>

      <div className="post-text">
        <p>{post.text_content}</p>
      </div>
    </div>
  );
};
