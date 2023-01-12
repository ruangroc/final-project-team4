/**@jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import Navigation from "../components/navbar";
import DevCard from "../components/devCard";

import {
  Container,
  Row,
  Col,
  Card,
  CardDeck,
  Button,
  Jumbotron,
} from "react-bootstrap";
import { css } from "@emotion/react";
import {
  Route,
  Switch,
  useParams,
  useRouteMatch,
  Redirect,
  Link,
} from "react-router-dom";
import { get } from "../utils/api";
import { useSelector } from "react-redux";
import { getAuth } from "../redux/selectors";
import Login from "../components/login";

function Developer() {
  const { developer } = useParams();
  const [dev, setDev] = useState([]);
  const [imageSrc, setImageSrc] = useState({
    thuyvy:
      "https://tse1.mm.bing.net/th?id=OIP.uW3kFSo4__DcR9zqy-_TDQHaFZ&pid=Api",
    anita:
      "http://3.bp.blogspot.com/--7gtJQo5mHE/UGMKHZapqmI/AAAAAAAAWGU/5X26Pgj_St4/s1600/funny-cat-pictures-017-005.jpg",
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
  const [devPlaylists, setDevPlaylists] = useState([]);

  const styles = css`
    .card {
      background-color: #3be378;
    }

    .dev-card {
      background-color: #3be378;
      width: 100%;
    }
    a {
      color: black;
    }

    .white {
      color: white;
      font-weight: bold;
    }

    ul {
      list-style: none;
    }
    .sidebar-header {
      text-align: left;
      width: 100%;
      margin-left: 2%;
    }
    .side-button {
      width: 90%;
      text-align: left;
      margin-top: 5%;
      margin-left: 5%;
    }

    .center {
      text-align: center;
    }
  `;

  const auth = useSelector(getAuth);
  const loggedIn = auth.loggedIn;

  useEffect(() => {
    if (loggedIn) {
      if (developer === "thuyvy") {
        fetchspotifyuser("tweetynguy");
        fetchPlaylists("tweetynguy");
      } else if (developer === "anita") {
        fetchspotifyuser("anitasmith98");
        fetchPlaylists("anitasmith98");
      } else {
        return <Redirect to="/error" />;
      }
    } else {
      console.log("not logged in!");
    }
  }, [developer, loggedIn]);

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
      const url = `https://api.spotify.com/v1/users/${user}/playlists`;
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
    `;

    return devPlaylists.map((item) => {
      return (
        <Card key={item.name} css={styles}>
          <Card.Title>
            <a
              href={`https://open.spotify.com/playlist/${item.id}`}
              target="_blank"
              rel="noreferrer"
            >
              {item.name}
            </a>
          </Card.Title>
          <Card.Img
            src={
              item.images.length
                ? item.images[0].url
                : "https://img.talkandroid.com/uploads/2016/01/spotify-app-logo-450x450.png"
            }
          />
        </Card>
      );
    });
  }

  return (
    <>
      {loggedIn ? (
        <Row css={styles}>
          <Col lg={2} xs={5} className="sidebar">
            <br></br>
            <Row className="sidebar-header">
              <h5>Developers </h5>
            </Row>
            <Link to="/developers/anita">
              <Button variant="secondary" className="side-button">
                <h6> Anita</h6>
              </Button>
            </Link>
            <Link to="/developers/thuyvy">
              <Button variant="secondary" className="side-button">
                <h6> ThuyVy</h6>
              </Button>
            </Link>
          </Col>
          <Col lg={2} xs={6}>
            <Row>
              {dev !== [] && (
                <Card className="dev-card">
                  <Card.Body>
                    <Card.Title>
                      {" "}
                      <h2>{dev.display_name} </h2>
                    </Card.Title>
                    <Card.Img
                      src={
                        dev.images && dev.images.length
                          ? dev.images[0].url
                          : imageSrc[developer]
                      }
                      className="dev-image"
                    />
                    {dev.followers && dev.followers.total && (
                      <Card.Text> {dev.followers.total} Followers </Card.Text>
                    )}
                    <Card.Link className="white" href={githubSrc[developer]}>
                      GitHub
                    </Card.Link>
                    <Card.Link className="white" href={linkedinSrc[developer]}>
                      Linkedin
                    </Card.Link>
                    <Card.Link className="white" href={websiteSrc[developer]}>
                      Website
                    </Card.Link>
                  </Card.Body>
                </Card>
              )}
            </Row>
          </Col>
          <Col lg={8} xs={12}>
            <Row>
              <Col>
                <br></br>
                <h3 className="center"> Playlists</h3>
                {devPlaylists !== [] ? (
                  <Row>{displayPlaylists()}</Row>
                ) : (
                  <p>"Loading playlists..."</p>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Login />
      )}
    </>
  );
}

function Developers() {
  const match = useRouteMatch();
  const { url, path } = match;

  const styles = css`
    .header {
      text-align: center;
    }

    ul {
      list-style: none;
    }

    .card-deck {
      width: 100%;
    }

    .card {
      max-width: 450px;
      margin-left: auto;
      margin-right: auto;
    }

    .card-body {
      text-align: center;
      padding-left: 0px;
      padding-right: 0px;
      margin: 0px;
    }

    .card-footer {
      text-align: center;
    }

    a {
      color: black;
    }
  `;

  const auth = useSelector(getAuth);
  const loggedIn = auth.loggedIn;
  console.log("logged in: ", loggedIn);

  return (
    <>
      <Navigation />
      <Jumbotron style={{ textAlign: "center" }}>
        <h1 class="display-4">about</h1>
        <br></br>
        <p class="lead">
          For our web development final, we asked ourselves how to make our
          professor laugh during the demo. The answer: add a dancing cat.
        </p>
        <p>
          We've made some updates since then but we know it's all about the
          cats.
        </p>
        <br></br>
        <a
          href="https://github.com/thuyvyng/spotifyInteractive"
          class="badge badge-info"
        >
          Github
        </a>{" "}
        <a
          href="https://developer.spotify.com/documentation/web-api/"
          class="badge badge-info"
        >
          SpotifyAPI
        </a>{" "}
        <a
          href="https://open.spotify.com/playlist/4YBShIMxSyiNX4M9q6dcxc?si=3c41c386b6454fcc"
          class="badge badge-info"
        >
          OurSpotifyPlaylist
        </a>
      </Jumbotron>
      <Container fluid css={styles}>
        <Switch>
          <Route path={`${path}/:developer`}>
            <Developer />
          </Route>
          <Route exact path={path}>
            <Row>
              <Col></Col>
              <Col xs={10}>
                <CardDeck>
                  <DevCard dev="anita" />
                  <DevCard dev="thuyvy" />
                </CardDeck>
              </Col>
              <Col></Col>
            </Row>
          </Route>
        </Switch>
      </Container>
    </>
  );
}

export default Developers;
