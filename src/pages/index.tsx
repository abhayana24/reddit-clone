import { Container, Typography } from "@mui/material";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { ListPostsQuery, Post } from "../API";
import PostPreview from "../components/PostPreview";
import { useUser } from "../context/AuthContext";
import * as queries from "../graphql/queries";

export default function Home() {
  const { user } = useUser();
  const [posts, setposts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      //Make a request to GraphQL API
      const allPosts = (await API.graphql({ query: queries.listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };
      if (allPosts.data) {
        setposts(allPosts.data.listPosts.items as Post[]);
        return allPosts.data.listPosts.items as Post[];
      } else {
        throw new Error("Could not get posts");
      }
    };

    fetchPostsFromApi();
  }, []);

  console.log("LOGGED IN USER:", user);
  console.log("Posts: ", posts);
  return (
    <Container maxWidth="md">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Container>
  );
}

// Get all the posts on the server side since all users can read posts in our schema logic
// we can use the api key authorization required
// We'll call some code to access our GraphQL API on the serverside, pass it to our function as props Render the posts
// on the home page to look like reddit posts
