import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useState } from "react";
import { Auth } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface IFormInput {
  username: string;
  password: string;
}

export default function Login() {
  const user = useUser();
  const [signInError, setsignInError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const amplifyUser = await Auth.signIn(data.username, data.password);
      console.log("Amplify User: ", amplifyUser);
      if (amplifyUser) {
        router.push("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("error signing in", error);
      setsignInError(error.message);
      setOpen(true);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        style={{ height: "800px" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid
            container
            direction="column"
            alignItems="center"
            justifySelf="end"
            spacing={1}
          >
            <Grid item>
              <h1>Login</h1>
            </Grid>
            <Grid item>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                type="text"
                error={errors.username ? true : false}
                helperText={errors.username ? errors.username.message : null}
                {...register("username")}
              />
            </Grid>

            <Grid item>
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                error={errors.password ? true : false}
                helperText={errors.password ? errors.password.message : null}
                {...register("password")}
              />
            </Grid>

            <Grid marginTop={3}>
              {" "}
              <Button variant="contained" type="submit">
                Sign In
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {signInError}
        </Alert>
      </Snackbar>
    </>
  );
}
