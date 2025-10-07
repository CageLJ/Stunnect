import { PostCard } from "../../components"
import { useFetch } from "../../hooks/useFetch";
import { useState } from "react";

export const PostsPage = () => {
    const [url, setUrl] = useState("http://localhost:8000/posts");
    const { data: posts, loading, error} = useFetch(url);
    // TODO: add the filter for posts on tag id


    return (
        <>
            <main>
                {loading && <p>Loading posts...</p>}
                {error && <p>{error}</p>}
            
                {posts && posts.map((post) => (
                    <PostCard post={post} key={post.id}/>
                )) }
            </main>
        </>
    )
}
