/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {Container, Row, Col} from 'react-bootstrap';
import {css} from '@emotion/react';
import {useState, useEffect} from 'react';


function CollabPlaylist() {
    useEffect(() => {
        fetch('https://api.spotify.com/v1/me/playlists?access_token=BQC_qSgf463Wxd7hVDcXRQNmKxPaNYmPcVLztn-MjJBKnP9j8g8XdOR19fgr7xJOEnTeggsi-WMnFqHhf-HTqSNVBTWHzsHhQxTOch1iReia539BgGEt9aSJXT8CWUjDs9gT1NjINgkK_uynyQ&token_type=Bearer&expires_in=3600')
        .then(response => response.json())
        .then(data => console.log("data received:", data));
    }, []);

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