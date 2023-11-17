import { BlogService } from "@/apis/blog/v1/posts_connect"
import { createClient } from "@/utils/connect"
import { deleteBlogPost, submitCreatePostForm } from "./actions"
import Post from "./Post"

export default async function Home() {
  const blogService = createClient(BlogService)

  const listPostResponse = await blogService.listPosts({})

  return (
    <>
      <h2>New Post</h2>
      <form action={submitCreatePostForm}>
        <div>
          <input name="title" type="text" placeholder="title" />
        </div>
        <div>
          <textarea name="content" placeholder="content" />
        </div>
        <div>
          <button type="submit">post</button>
        </div>
      </form>
      <h2>Posts</h2>
      {listPostResponse.posts.map((post) => (
        <Post key={post.id} id={post.id} title={post.title} content={post.content}/>
      ))}
    </>
  )
}
