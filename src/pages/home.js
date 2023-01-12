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

        <Jumbotron
          style={{
            backgroundColor: "white",
          }}
        >
          <h1
            style={{
              color: "#84A59D",
              fontWeight: "bold",
              fontFamily: "Coiny",
              fontSize: "10vw",
            }}
          >
            unpaws the music
          </h1>
          <p class="lead">
            Find out what kind of cat your music tastes create, learn more about
            your music habits, and combine your playlists with our playlist
            combiner feature here!
          </p>
        </Jumbotron>

        <Row>
          <Col>{loggedIn ? <div></div> : <Login />}</Col>
        </Row>
      </Container>
    </div>
  );
}
