/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import {css} from '@emotion/react';
import {useState, useEffect} from 'react';


function CollabPlaylist() {
    return (
        <>
        <Navigation/>
        <Container>
            <Row>
                <Col>
                    <h1> Share your music!</h1>
                </Col>
            </Row>

        </Container>
    </>
    );
  }

  export default CollabPlaylist;