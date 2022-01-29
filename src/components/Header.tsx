import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useUser } from "../context/AuthContext";
import RedditIcon from "@mui/icons-material/Reddit";
import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import router from "next/router";
import { Auth } from "aws-amplify";
import AddIcon from "@mui/icons-material/Add";

export default function Header() {
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signUserOut = async () => {
    await Auth.signOut();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => router.push("/")}
          >
            <RedditIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Reddit Clone
          </Typography>
          {user && (
            <div>
              <Tooltip title="Add New Post">
                <IconButton
                  aria-label="Create New Post"
                  color="inherit"
                  onClick={() => router.push("/create")}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => signUserOut()}>Sign Out</MenuItem>
              </Menu>
            </div>
          )}
          {!user && (
            <>
              <Button
                variant="outlined"
                style={{ marginRight: 8 }}
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push("/signup")}
              >
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
