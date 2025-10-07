import { Link } from "react-router-dom";
import "./PostCard.css"

export const PostCard = ({post}) => {
    return (
        <div className="card">
            <div className="infoSection">
                <Link to={`/user/${post.custom_user_id}`} className="Postuser">
                    User id:{post.custom_user_id}
                </Link>
                <Link className="postTag">Tag id: {post.id}</Link>
            </div>
            <div className="textSection">
                <Link to={`/posts/${post.id}`}>
                    <p>{post.text_content}</p>
                </Link>
            </div>
        </div>
    )
}