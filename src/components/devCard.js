import React from "react";
import { useState, useEffect } from "react";

import { Card, CardGroup } from "react-bootstrap";
import { get } from "../utils/api";
import { useSelector } from "react-redux";
import { getAuth } from "../redux/selectors";
import { Redirect } from "react-router-dom";
import { css } from "@emotion/react";

function DevCard(props) {
  const [dev, setDev] = useState([]);
  const [devPlaylists, setDevPlaylists] = useState([]);
  const auth = useSelector(getAuth);
  const loggedIn = auth.loggedIn;

  const [imageSrc, setImageSrc] = useState({
    thuyvy:
      "https://tse1.mm.bing.net/th?id=OIP.uW3kFSo4__DcR9zqy-_TDQHaFZ&pid=Api",
    anita:
      "http://3.bp.blogspot.com/--7gtJQo5mHE/UGMKHZapqmI/AAAAAAAAWGU/5X26Pgj_St4/s1600/funny-cat-pictures-017-005.jpg",
  });

  const [spotifySrc, setSpotify] = useState({
    thuyvy: "Thuy-Vy",
    anita: "anitasmith98",
  });

  const [nameSrc, setName] = useState({
    thuyvy: "tweetynguy",
    anita: "Anita",
  });

  const [githubSrc, setGithubSrc] = useState({
    thuyvy: "https://github.com/thuyvyng",
    anita: "https://github.com/ruangroc",
  });

  const [linkedinSrc, setLinkedinSrc] = useState({
    thuyvy: "https://www.linkedin.com/in/thuyvyng/",
    anita: "https://www.linkedin.com/in/anita-ruangrotsakun/",
  });

  const [websiteSrc, setWebsiteSrc] = useState({
    thuyvy: "https://thuyvyng.github.io/",
    anita: "https://ruangroc.github.io/",
  });

  useEffect(() => {
    if (loggedIn) {
      if (props.dev === "thuyvy") {
        fetchspotifyuser("tweetynguy");
        fetchPlaylists("tweetynguy");
      } else if (props.dev === "anita") {
        fetchspotifyuser("anitasmith98");
        fetchPlaylists("anitasmith98");
      } else {
        return <Redirect to="/error" />;
      }
    } else {
      console.log("not logged in!");
    }
  }, [loggedIn]);

  async function fetchspotifyuser(user) {
    try {
      const url = `https://api.spotify.com/v1/users/${user}`;
      const result = await get(url, { access_token: auth.accessToken });
      console.log("fetch spotify user result:", result);
      setDev(result || []);
    } catch (e) {
      if (e instanceof DOMException) {
        console.log("HTTP Request Aborted");
      }
      console.log("error fetching user", e);
    }
  }

  async function fetchPlaylists(user) {
    try {
      const url = `https://api.spotify.com/v1/users/${user}/playlists?limit=4`;
      const result = await get(url, { access_token: auth.accessToken });
      console.log("fetch spotify user playlists:", result);
      setDevPlaylists(result.items || []);
    } catch (e) {
      if (e instanceof DOMException) {
        console.log("HTTP Request Aborted");
      }
      console.log("error fetching playlists", e);
    }
  }

  function displayPlaylists() {
    const styles = css`
      a {
        color: black;
      }

      .card {
        margin: auto;
      }
    `;

    return devPlaylists.map((item) => {
      return (
        <Card>
          <a
            href={`https://open.spotify.com/playlist/${item.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <Card.Img
              src={
                item.images.length
                  ? item.images[0].url
                  : "https://img.talkandroid.com/uploads/2016/01/spotify-app-logo-450x450.png"
              }
              width="20px"
            />
            {item.name}
          </a>
        </Card>
      );
    });
  }
  return (
    <Card>
      <Card.Body>
        <a
          href={`https://open.spotify.com/user/${spotifySrc[props.dev]}`}
          target="_blank"
          rel="noreferrer"
        >
          <Card.Title>
            <h3> {dev.display_name} </h3>
          </Card.Title>
          <Card.Img
            src={
              dev.images && dev.images.length
                ? dev.images[0].url
                : imageSrc[props.dev]
            }
            className="dev-image"
            style={{ maxWidth: "35%" }}
          />
        </a>
        <br></br>
        <br></br>
        <Card.Subtitle>Playlists</Card.Subtitle>
        {devPlaylists !== [] ? (
          <CardGroup style={{ width: "80%", margin: "auto" }}>
            {displayPlaylists()}
          </CardGroup>
        ) : (
          <p>"Loading playlists..."</p>
        )}
      </Card.Body>
      <Card.Footer>
        <Card.Link href={githubSrc[props.dev]}>GitHub</Card.Link>
        <Card.Link href={linkedinSrc[props.dev]}>Linkedin</Card.Link>
        <Card.Link href={websiteSrc[props.dev]}>Website</Card.Link>
      </Card.Footer>
    </Card>
  );
}

export default DevCard;
