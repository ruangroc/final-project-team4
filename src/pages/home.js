import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';


export default function Home() {
    return (
     <>
         <Navigation/>
         <Container>
             <Row>
                 <Col>
                     <h1>  Spotify</h1>
                 </Col>
             </Row>
         </Container>
     </>
    );
  }