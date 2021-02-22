/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import {css} from '@emotion/react';


function CombinePlaylists() {


    return (
        <>
        <Navigation/>
        <Container>
            <Row>
                <Col>
                    <h1> Combine your playlists!</h1>
                </Col>
            </Row>

        </Container>
    </>
    );
  }

  export default CombinePlaylists;