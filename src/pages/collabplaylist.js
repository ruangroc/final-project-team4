/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getAuth } from "../redux/selectors";

import Login from "../components/login";

function CollabPlaylist() {
  const auth = useSelector(getAuth);
  const loggedIn = auth.loggedIn;

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col>
            <h1> Share your music!</h1>
            {loggedIn ? <div>logged in!</div> : <Login />}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CollabPlaylist;
