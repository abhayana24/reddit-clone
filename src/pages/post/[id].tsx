import React, { ReactElement } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { API, withSSRContext } from "aws-amplify";
import * as queries from "../../graphql/queries";
import { GetPostQuery, ListPostsQuery, Post } from "../../API";
import PostPreview from "../../components/PostPreview";
import { Container } from "@mui/material";
import PostComments from "../../components/PostComments";

interface Props {
  post: Post;
}

function IndividualPost({ post }: Props): ReactElement {
  console.log("Got Post:", post);
  return (
    <Container maxWidth="md">
      <PostPreview post={post} />
      {/* Start rendering comments */}
      {post.comments.items.map((comment) => (
        <PostComments key={comment.id} comment={comment} />
      ))}
    </Container>
  );
}
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Call AWS Amplify backend to get post by id
  const SSR = withSSRContext();

  const postsQuery = (await SSR.API.graphql({
    query: queries.getPost,
    variables: {
      id: params.id,
    },
  })) as { data: GetPostQuery };

  return {
    props: {
      post: postsQuery.data.getPost,
    },
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();
  const allPosts = (await SSR.API.graphql({ query: queries.listPosts })) as {
    data: ListPostsQuery;
    errors: any[];
  };

  // Get the paths we want to pre-render based on posts
  const paths = allPosts.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
};

export default IndividualPost;
