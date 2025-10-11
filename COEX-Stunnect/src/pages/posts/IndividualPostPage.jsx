import { useParams, Link } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch";
import { useState } from "react";

export const IndividualPostPage = () => {
    const params = useParams();
    const [url, setUrl] = useState(`http://localhost:8000/posts/${params.id}`);
    const { data: post, loading, error} = useFetch(url);

    return (
        <main>
            {loading && <p>Loading posts...</p>}
            {error && <p>{error}</p>}
            {post && 
            <>
                <div className="infoSection">
                    <Link to={`/user/${post.custom_user_id}`} className="Postuser">
                        User id:{post.custom_user_id}
                    </Link>
                    <p className="postTag">Tag id: {post.tag_id}</p>
                </div>
                <div>
                    <p>{post.text_content}</p>
                </div>
            </>  
            }
        </main>
    )
}
