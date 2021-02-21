import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';


export default function Developers() {
    return (
        <>
        <Navigation/>
        <Container>
            <Row>
                <Col>
                    <h1>Meet the Developers!</h1>
                </Col>
            </Row>
        </Container>
    </>
    );
  }