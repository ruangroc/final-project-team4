import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import { Button } from 'react-bootstrap';



export default function Home() {

    const handleLogin = () => {

    };

    return (
     <>
         <Navigation/>
         <Container>
             <Row>
                 <Col>
                     <h1> Spotify Interactive </h1>
                     
                 </Col>
             </Row>
             <Row>
                 <Col>
                    <Button variant="info" type="submit" onClick={handleLogin}>
                        Login to spotify
                    </Button>
                 </Col>
             </Row>
         </Container>
     </>
    );
  }