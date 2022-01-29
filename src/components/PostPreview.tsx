import { ButtonBase, Grid, Paper, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import { Post } from "../API";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useRouter } from "next/router";
import formatDatePosted from "../lib/formatDatePosted";

interface Props {
  post: Post;
}

export default function PostPreview({ post }: Props): ReactElement {
  const router = useRouter();

  // const getRandomImage = async (): Promise<string> => {
  //   const response = await fetch(
  //     "https://api.unsplash.com/photos/random?client_id=DQFZSezm_1O157KxOoXHNQluYS-3HJXIAiMasLcFuCw"
  //   );
  //   const data = await response.json();
  //   return data.urls.thumb;
  // };
  // const url = getRandomImage();

  let seed = Math.floor(Math.random() * 10000 + 1);

  return (
    <Paper elevation={5}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        wrap="nowrap"
        spacing={3}
        style={{ padding: 12, marginTop: 24 }}
      >
        <Grid item style={{ maxWidth: 128 }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton color="inherit">
                <ArrowUpwardIcon style={{ maxWidth: 20 }} />
              </IconButton>
            </Grid>
            <Grid container alignItems="center" direction="column">
              <Grid item>
                <Typography variant="h6">
                  {(post.upvotes - post.downvotes).toString()}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">votes</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton color="inherit">
                <ArrowDownwardIcon style={{ maxWidth: 20 }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        {/* Content Preview */}
        <Grid item>
          <ButtonBase onClick={() => router.push(`/post/${post.id}`)}>
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item>
                <Typography variant="body1">
                  Created by <b>{post.owner}</b>{" "}
                  {formatDatePosted(post.createdAt)} hours ago
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h1">{post.title}</Typography>
              </Grid>
              <Grid item style={{ maxHeight: 32, overflow: "hidden" }}>
                <Typography variant="body1">{post.contents}</Typography>
              </Grid>
              <Grid item>
                <Image
                  src={`https://picsum.photos/seed/${seed}/980/540`}
                  height={540}
                  width={980}
                  layout="intrinsic"
                />
              </Grid>
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}
