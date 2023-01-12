import Navigation from "../components/navbar";

import { Container, Row, Col, Jumbotron } from "react-bootstrap";

import { useSelector } from "react-redux";
import { getAuth } from "../redux/selectors";
import Login from "../components/login";

export default function Home() {
  const auth = useSelector(getAuth);
  const loggedIn = auth.loggedIn;
  console.log("logged in: ", loggedIn);

  return (
    <div>
      <Navigation />
      <Container>
        <br></br>
        <br></br>
        <br></br>
        <Jumbotron
          style={{
            backgroundColor: "white",
          }}
        >
          <Row>
            <Col xs={8}>
              <h1
                style={{
                  color: "#84A59D",
                  fontWeight: "bold",
                  fontFamily: "Coiny",
                  fontSize: "7.5vw",
                }}
              >
                unpaws the music
              </h1>
            </Col>
            <Col>
              <img
                src="/cat.png"
                style={{
                  width: "100%",
                }}
              />
            </Col>
          </Row>
          <p class="lead">
            Find out what kind of cat your music tastes create, learn more about
            your music habits, and combine your playlists with our playlist
            combiner feature here!
          </p>
          <a
            href="https://github.com/thuyvyng/spotifyInteractive"
            class="badge badge-warning"
          >
            Github
          </a>{" "}
          <a
            href="https://developer.spotify.com/documentation/web-api/"
            class="badge badge-warning"
          >
            SpotifyAPI
          </a>{" "}
          <a
            href="https://open.spotify.com/playlist/4YBShIMxSyiNX4M9q6dcxc?si=3c41c386b6454fcc"
            class="badge badge-warning"
          >
            OurSpotifyPlaylist
          </a>
        </Jumbotron>

        <Row>
          <Col>{loggedIn ? <div></div> : <Login />}</Col>
        </Row>
      </Container>
    </div>
  );
}
