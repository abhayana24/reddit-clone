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
  email: string;
  password: string;
  code: string;
}

export default function Signup() {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [signUpError, setsignUpError] = useState<string>("");
  const [showCode, setshowCode] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpAWS(data);
        setshowCode(true);
      }
    } catch (err) {
      setsignUpError(err.message);
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

  async function signUpAWS(data: IFormInput): Promise<CognitoUser> {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up a user: ", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      const suser = await Auth.signIn(username, password);
      console.log("Success signed in the user: ", suser);
      if (suser) {
        router.push("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  console.log("The value of the user from the hook is: ", user);
  return (
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
          justifySelf="center"
          spacing={1}
        >
          <Grid item>
            <h1>Sign Up</h1>
          </Grid>
          <Grid item>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              type="text"
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : null}
              {...register("username", {
                required: { value: true, message: "Please enter a username" },
                minLength: {
                  value: 3,
                  message: "Please enter a username between 3-16 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Please enter a username between 3-16 charatcers",
                },
              })}
            />
          </Grid>

          <Grid item>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email.message : null}
              {...register("email", {
                required: {
                  value: true,
                  message: "Please enter a valid email",
                },
              })}
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
              {...register("password", {
                required: {
                  value: true,
                  message: "Please enter a valid password",
                },
                minLength: {
                  value: 8,
                  message:
                    "Please enter a stronger password (greater than 8 character)",
                },
              })}
            />
          </Grid>

          {showCode && (
            <Grid item>
              <TextField
                id="code"
                label="Verification Code"
                variant="outlined"
                type="password"
                error={errors.code ? true : false}
                helperText={errors.code ? errors.code.message : null}
                {...register("code", {
                  required: {
                    value: true,
                    message: "Please enter a valid code",
                  },
                  minLength: {
                    value: 6,
                    message: "Please enter a valid 6 digit verfication code",
                  },
                  maxLength: {
                    value: 6,
                    message: "Please enter a valid 6 digit verification code",
                  },
                })}
              />
            </Grid>
          )}

          <Grid marginTop={3}>
            {" "}
            <Button variant="contained" type="submit">
              {showCode ? "Confirm Code" : "Sign Up"}
            </Button>
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {signUpError}
          </Alert>
        </Snackbar>
      </form>
    </Grid>
  );
}
