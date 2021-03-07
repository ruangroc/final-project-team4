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
        h4 {
            margin: 1%;
        }
        h5 {
            margin: 0 auto;
        }
        .card {
            background-color: #3BE378;
            height: 100%;
            width: 100%;
            text-align: center;
        }
        #cat-container {
            width: 100%;
            height: 100%;
            border: 2px solid black;
        }
    `;

    const [topArtists, setTopArtists] = useState({});
    const [topTracks, setTopTracks] = useState({});
    const [audioFeatures, setAudioFeatures] = useState({});

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;

    useEffect(() => {
        console.log("access token:", auth.accessToken);
        if (loggedIn) {
            fetchTopArtists();
            fetchTopTracks();
        }
        else {
            console.log("not logged in!");
        }
    }, []);

    useEffect(() => {
        if (topTracks !== {}) fetchAudioFeatures();
    }, [topTracks]);

    async function fetchAudioFeatures() {
        try{
            const trackIds = topTracks.items.map(song => song.id).join();
            const url = `https://api.spotify.com/v1/audio-features?ids=${trackIds}`;
            const result = await get(url, { access_token: auth.accessToken });
            console.log("fetch audio features:", result.audio_features);
            setAudioFeatures(result.audio_features || {});
        } catch (e){
            if ( e instanceof DOMException){
                console.log("HTTP Request Aborted");
            }
            console.log("error fetching audio features", e);
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
                <Col lg={1} md={2} xs={3}>
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
                <Col lg={1} md={2} xs={3}>
                    <Button key={song.uri} className="card">
                        <h5><a href={song.external_urls.spotify} target="_blank">{song.name}</a></h5>
                    </Button>
                </Col>
            );
        });
    }

    // artists: popularity, genres
    // tracks: popularity, duration (ms)
    // audio features from a tracK: acousticness, danceability, duration (ms), energy, 
    // instrumentalness, key, liveness, loudness, mode, speechiness, tempo (bpm), 
    // time signature, valence (positivity)
    // can make a single api call by passing comma separated list of track ids: https://developer.spotify.com/console/get-audio-features-track/

    // background color: energy (purple - highest energy), ranges from 0.0 to 1.0
    // background opacity: loudness (1 = loudest)
    
    function average(array) {
        return array.reduce((a, b) => a + b) / array.length;
    }

    function computeBackgroundColor() {
        const colors = ["#F94144", "#F8961E", "#F9C74F", "#55A630", "#00AFB9", "#0077B6", "#8E7DBE"];
        let energyArray = audioFeatures.map(item => item.energy);
        let averageEnergy = average(energyArray);
        console.log("average:", averageEnergy);
        let index = Math.round(6*averageEnergy);
        return colors[index];
    }

    function computeBackgroundOpacity() {
        let loudnessArray = audioFeatures.map(item => item.loudness);
        let averageLoudness = average(loudnessArray);
        console.log("average loudness:", averageLoudness);
        let opacity = (averageLoudness + 65) * (1/65);
        console.log("opacity:", opacity);
        return opacity;
    }

    function displayCatVis() {
        if (audioFeatures !== {}) {
            const containerCss = {
                backgroundColor:  computeBackgroundColor(),
                opacity: computeBackgroundOpacity()
            };
            return (
                <div id="cat-container" style={containerCss}>Cat</div>
            );
        }
        return (<p>Loading cat visualization...</p>);
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
            <Row><h4>Cat visualization created based on your top songs</h4></Row>
            <Row>{displayCatVis()}</Row>
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
