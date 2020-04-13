import matter from "gray-matter";
import Link from "next/link";
import * as React from "react";
import BlogPost from "../../components/BlogPost";
import Layout from "../../components/Layout";
import { IBlogPost } from "./[slug]";

const BLOG_PREFIX = "/blog/";
const createBlogPathname = (slug: string) => BLOG_PREFIX + slug;

const Blog = ({ blogPosts }: { blogPosts: BlogPostsType }) => (
  <Layout>
    <ul style={{ listStyle: "none" }}>
      {blogPosts.map((post) => {
        return (
          <li key={post.slug}>
            <Link href={{ pathname: createBlogPathname(post.slug) }}>
              <BlogPost post={post} url={createBlogPathname(post.slug)} />
            </Link>
          </li>
        );
      })}
    </ul>
  </Layout>
);

export default Blog;

export async function getStaticProps() {
  //get posts & context from folder
  const posts = getContentFromPosts(
    require.context("../../posts", true, /\.md$/)
  );

  return {
    props: {
      blogPosts: posts,
    },
  };
}

type BlogPostsType = IBlogPost[];

const getContentFromPosts = (context) => {
  const keys = context.keys();
  const values = keys.map(context);

  const data: BlogPostsType = keys.map((key, index) => {
    // Create slug from filename
    const slug = key
      .replace(/^.*[\\\/]/, "")
      .split(".")
      .slice(0, -1)
      .join(".");
    const value = values[index];
    // Parse yaml metadata & markdownbody in document
    const document = matter(value.default);

    return {
      metadata: document.data,
      body: document.content,
      slug,
    };
  });
  return data;
};
