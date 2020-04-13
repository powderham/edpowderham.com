import { IBlogPost } from "../../pages/blog/[slug]";
import { BlogPostItem } from "./styles";

const BlogPost = ({ post, url }: { post: IBlogPost; url: string }) => (
  <div>
    <BlogPostItem className="item">
      <a className="url" href={url}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3 className="title">{post.metadata.title}</h3>
          <p className="date">
            {new Date(post.metadata.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </a>
    </BlogPostItem>
  </div>
);

export default BlogPost;
