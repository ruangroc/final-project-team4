import Navigation from "../components/navbar";
import { Container, Row, Col } from "react-bootstrap";

export default function Error() {
  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col>
            <h1>404</h1>
          </Col>
        </Row>
      </Container>
    </>
  );
}
