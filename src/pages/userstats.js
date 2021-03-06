/**@jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import {Container, Row, Col, Card, Button, CardDeck} from 'react-bootstrap';
import {css} from '@emotion/react';
import { get } from '../utils/api';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';

// Spotify Auth package
import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles

export default function UserStats() {
    const styles = css``;

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;

    return (
    <>
        <Navigation/>
        {loggedIn ? 
        (<Container fluid>
            <Row>
                <Col><h2>Your Spotify Statistics</h2></Col>
            </Row>
            <Row>Top 5 Songs</Row>
            <Row>Top 5 Playlists</Row>
            <Row>Etc user stats</Row>
            <Row>Create a cat image or landscape from recently played songs?</Row>
        </Container>) 
        : 
        (<div>
            <h5>Please login to use this feature!</h5>
            <SpotifyAuth
                redirectUri='http://localhost:3000/redirect'
                clientID='164e3321d4714ea2b1d88976aeecb258'
                scopes={[Scopes.userReadPrivate, Scopes.userReadEmail]}
            />
        </div>)
        }
    </>
    );
}
