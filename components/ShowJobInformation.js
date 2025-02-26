import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import _ from "lodash";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { host } from "../utils/constants";

const ShowJobInformation = (props) => {
  const styles = {
    root: {
      maxWidth: 365,
      height: "fit-content",
    },
    cardContentContainer: {
      height: "200px",
      overflow: "auto",
    },
    cardContainer: {
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      marginTop: "0px",
    },
    uploadProgress: {
      marginLeft: "16.5px",
    },
    button: {
      fontSize: "11px",
    },
    cardImage: {
      maxHeight: "400px",
    },
  };

  const router = useRouter();

  const [data, setData] = useState({
    title: "",
    description: "",
    previewLink: "https://bub2.toolforge.org",
    imageLinks: {},
    uploadStatus: {
      isUploaded: false,
      uploadLink: "",
    },
    queueName: props.queue_name,
  });

  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (props.queue_name && props.job_id) {
        setLoading(true);
        fetch(
          `${host}/getJobInformation?queue_name=${props.queue_name}&job_id=${props.job_id}`
        )
          .then((resp) => resp.json())
          .then((resp) => {
            setData(resp);
            setProgress(resp.progress);
          })
          .catch((err) => console.error(err));
      }
    } catch (err) {
      console.log(err, "::err");
    } finally {
      setLoading(false);
    }
  }, [props.queue_name, props.job_id]);

  if (loading) {
    return <CircularProgress />;
  } else {
    return (
      <div style={styles.cardContainer}>
        <Card sx={styles.root}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={data.title}
              image={data.imageLinks ? data.imageLinks.small : data.coverImage}
              title={data.title}
              sx={styles.cardImage}
            />
            <CardContent
              sx={
                data.description && data.description.length > 0
                  ? styles.cardContentContainer
                  : null
              }
            >
              <Typography gutterBottom variant="h2">
                {data.title}
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {data.description}
              </Typography>
            </CardContent>
            <Typography
              variant="h5"
              color="textSecondary"
              sx={styles.uploadProgress}
            >
              <strong>Upload Progress:</strong> {progress}%
            </Typography>
          </CardActionArea>

          <CardActions>
            {data.uploadStatus.isUploaded ? (
              <Link passHref href={data.uploadStatus.uploadLink}>
                <Button
                  sx={styles.button}
                  target="_blank"
                  size="large"
                  color="primary"
                >
                  View on Internet Archive
                </Button>
              </Link>
            ) : null}
            <Link passHref href={data.previewLink}>
              <Button
                sx={styles.button}
                target="_blank"
                size="large"
                color="primary"
              >
                View on {data.queueName}
              </Button>
            </Link>
          </CardActions>
        </Card>
      </div>
    );
  }
};

export default ShowJobInformation;
