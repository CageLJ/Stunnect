import { Link } from "react-router-dom";
import "./PostCard.css"

export const PostCard = ({post}) => {
    return (
        <div className="card">
            <Link to={`/posts/${post.id}`}>
                <div className="infoSection">
                    <Link to={`/user/${post.custom_user_id}`} className="Postuser">
                        User id:{post.custom_user_id}
                    </Link>
                    <Link className="postTag">Tag id: {post.id}</Link>
                </div>
                <div className="textSection">
                    <p>{post.text_content}</p>
                </div>
            </Link>
        </div>
    )
}