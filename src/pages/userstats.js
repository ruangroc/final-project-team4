/**@jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import {Container, Row, Col, Card, Button, CardDeck} from 'react-bootstrap';
import {css} from '@emotion/react';
import { get } from '../utils/api';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';
import scopes from '../utils/scopes';

// Spotify Auth package
import { SpotifyAuth } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'; // if using the included styles

// stretch goal: allow users to select short, medium, or long term stats
// stretch goal: create a cat or landscape of cats based on song attributes (danceability, loudness, tempo, key)
//      Could try to implement css or svg animations based on some variable as well

// other data vis ideas
// word cloud or bar chart of the most common genres (data from artists and tracks)
// five number summary for popularity for artists and/or songs (a line chart or histogram or something, with 100 = most popular)

export default function UserStats() {
    const styles = css`
        a {
            color: black;
        }
        .card {
            background-color: #3BE378;
            height: 100%;
        }
    `;

    const [topArtists, setTopArtists] = useState({});
    const [topTracks, setTopTracks] = useState({});

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;

    useEffect(() => {
        console.log("access token:", auth.accessToken);
        if (loggedIn) {
            // fetchMyProfile();  // to test whether the api will work
            fetchTopArtists();
            fetchTopTracks();
        }
        else {
            console.log("not logged in!");
        }
    }, []);

    async function fetchMyProfile() {
        try{
            const url = `https://api.spotify.com/v1/me`;
            const result = await get(url, { access_token: auth.accessToken });
            console.log("fetch my profile:", result);
            setTopArtists(result || {});
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted");
            }
            console.log("error fetching my profile", e);
        }
    }

    async function fetchTopArtists() {
        try{
            const url = `https://api.spotify.com/v1/me/top/artists?limit=10`;
            const result = await get(url, { access_token: auth.accessToken });
            console.log("fetch top artists result:", result);
            setTopArtists(result || {});
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted");
            }
            console.log("error fetching top artists", e);
        }
    }

    async function fetchTopTracks() {
        try{
            const url = `https://api.spotify.com/v1/me/top/tracks?limit=10`;
            const result = await get(url, { access_token: auth.accessToken });
            console.log("fetch top tracks result:", result);
            setTopTracks(result || {});
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted");
            }
            console.log("error fetching top tracks", e);
        }
    }

    function displayTopArtists() {
        if (topArtists.items === undefined) {
            return <p>Loading top artists...</p>
        }
        return topArtists.items.map(artist => {
            return (
                <Col xs={1}>
                    <Card key={artist.uri} className="card">
                        <Card.Title>
                            <Card.Img src={artist.images[2].url} />
                            <a href={artist.external_urls.spotify} target="_blank">{artist.name}</a>
                        </Card.Title>
                    </Card>
                </Col>
            );
        });
    }

    function displayTopTracks() {
        if (topTracks.items === undefined) {
            return <p>Loading top tracks...</p>
        }
        return topTracks.items.map(song => {
            return (
                <Col xs={1}>
                    <Card key={song.uri} className="card">
                        <Card.Title>
                            <a href={song.external_urls.spotify} target="_blank">{song.name}</a>
                        </Card.Title>
                    </Card>
                </Col>
            );
        });
    }

    return (
    <>
        <Navigation/>
        {loggedIn ? 
        (<Container fluid css={styles}>
            <Row>
                <Col><h2>Your Spotify Statistics</h2></Col>
            </Row>
            <Row><h4>Your Top 10 Songs</h4></Row>
            <Row>{ topTracks !== {} ? displayTopTracks() : <p>Loading top tracks...</p> }</Row>
            <Row><h4>Your Top 10 Artists</h4></Row>
            <Row>{ topArtists !== {} ? displayTopArtists() : <p>Loading top artists...</p> }</Row>
            <Row>Cool data visualizations</Row>
        </Container>) 
        : 
        (<div>
            <h5>Please login to use this feature!</h5>
            <SpotifyAuth
                redirectUri='http://localhost:3000/redirect'
                clientID='164e3321d4714ea2b1d88976aeecb258'
                scopes={scopes}
            />
        </div>)
        }
    </>
    );
}
