import Navigation from "../components/navbar";

import { Container, Row, Col, Jumbotron, Button } from "react-bootstrap";

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

        <Jumbotron
          style={{
            backgroundColor: "#FFFFD7",
          }}
        >
          <h1
            style={{
              color: "#54BEDC",
              fontWeight: "bold",
              fontFamily: "Coiny",
              fontSize: "xxx-large",
            }}
          >
            unpaws the music
          </h1>
          <p>
            Learn and interact with your Spotify music taste with statistics and
            cat visualizations. Find out what music the developers are listening
            to and combine your playlists with our playlist combiner feature.
          </p>
          <br></br>
          <br></br>
          <Button
            variant="outline-success"
            href="https://github.com/osu-cs499-w21/final-project-team4"
          >
            Github
          </Button>
        </Jumbotron>

        <Row>
          <Col>{loggedIn ? <div></div> : <Login />}</Col>
        </Row>
      </Container>
    </div>
  );
}
