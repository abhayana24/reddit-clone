import { createStyles, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumb: {
      display: "inline-flex",
      borderRadius: 2,
      border: "1px solid #eaeaea",
      marginBottom: 8,
      marginRight: 8,
      width: 100,
      height: 100,
      padding: 4,
      boxSizing: "border-box",
    },
    thumbsContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 16,
    },
    thumbInner: {
      display: "flex",
      minWidth: 0,
      overflow: "hidden",
    },
    img: {
      display: "block",
      width: "auto",
      height: "100%",
    },
  })
);

export default function ImageDropZone(props) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div className={classes.thumb} key={file.name}>
      <div className={classes.thumbInner}>
        <img src={file.preview} className={classes.img} />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section
      className="container"
      style={{
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#ffffff",
        minHeight: 128,
      }}
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside className={classes.thumbsContainer}>{thumbs}</aside>
    </section>
  );
}
