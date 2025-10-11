import { Link, useNavigate } from "react-router-dom";
import "./PostCard.css"

export const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent click if user clicked an actual link inside
    if (e.target.closest("a")) return;
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="infoSection">
        <Link to={`/user/${post.custom_user_id}`} className="Postuser">
          User id: {post.custom_user_id}
        </Link>
        <span className="postTag">Tag id: {post.tag_id}</span>
      </div>

      <div className="textSection">
        <p>{post.text_content}</p>
      </div>
    </div>
  );
};