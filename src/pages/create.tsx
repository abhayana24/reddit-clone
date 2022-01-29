import { Button, Container, Grid, TextField } from "@mui/material";
import React, { ReactElement } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ImageDropZone from "../components/ImageDropZone";

interface IFormInput {
  title: string;
  content: string;
  image?: string;
}

function Create() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container spacing={2} direction="column">
          {/* Post Title */}
          <Grid item>
            <TextField
              id="title"
              label="Post Title"
              variant="outlined"
              type="text"
              fullWidth
              error={errors.title ? true : false}
              helperText={errors.title ? errors.title.message : null}
              {...register("title", {
                required: { value: true, message: "Please enter a title" },
                maxLength: {
                  value: 120,
                  message: "Please enter title less than 120 characters",
                },
              })}
            />
          </Grid>
          {/* Post Content */}
          <Grid item>
            <TextField
              id="content"
              label="Post Content"
              variant="outlined"
              type="text"
              multiline
              fullWidth
              error={errors.content ? true : false}
              helperText={errors.content ? errors.content.message : null}
              {...register("content", {
                required: {
                  value: true,
                  message: "Please enter some content for your post",
                },
                maxLength: {
                  value: 1000,
                  message: "Content should have max length as 1000 characters",
                },
              })}
            />
          </Grid>
          <Grid item>
            <ImageDropZone />
          </Grid>
          <Grid item>
            <Button variant="contained" fullWidth>
              Create Post
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Create;
