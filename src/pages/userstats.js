/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {Container, Row, Col, Card, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {css} from '@emotion/react';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';
import scopes from '../utils/scopes';
import { get } from '../utils/api';
import { useState, useEffect } from 'react';


// Spotify Auth package
import { SpotifyAuth } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'; // if using the included styles

// stretch goal: add ability to let users select if they want to see short, medium, or long term stats

export default function UserStats() {
    const styles = css`
        a {
            color: black;
        }
        h4 {
            margin: 1%;
        }
        h5 {
            margin: 0;
            margin-left: 2%;
            text-align: left;
        }
        .song-image {
            width: 10%;
            margin: 1%;
        }
        .card {
            background-color: #3BE378;
            height: 100%;
            width: 100%;
            text-align: center;
        }
        .cards-container {
            padding-left: 1%;
            padding-right: 1%;
        }
        #cat-container {
            width: 50%;
            height: 100%;
            border: 2px solid black;
            margin: auto;
        }
        #left-eye {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            position: relative;
            top: 50%;
            left: 20%;
            background-color: black;
            margin: 0px;
            display: inline-block;
        }
        #right-eye {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            position: relative;
            top: 50%;
            left: 70%;
            background-color: black;
            margin: 0px;
            display: inline-block;
        }
        #nose {
            width: 0; 
            height: 0; 
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid #000;
            position: relative;
            top: 60%;
            left: 45%;
        }
        .explanations {
            width: 50%;
            margin: 1% auto;
        }
        @keyframes tongue-animation {
            0% { height: 0% }
            10% { height: 1% }
            20% { height: 2% }
            30% { height: 3% }
            40% { height: 4% }
            50% { height: 5% }
            60% { height: 6% }
            70% { height: 7% }
            80% { height: 8% }
            90% { height: 9% }
            100% { height: 10% }
        }
        @keyframes ear-animation {
            0% { transform: rotate(-10deg) }
            25% { transform: rotate(0deg) }
            50% { transform: rotate(10deg) }
            75% { transform: rotate(0deg) }
            100% { transform: rotate(-10deg) }
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
                            <Card.Img src={(artist.images && artist.images.length > 1 && artist.images[2]) ? artist.images[2].url : artist.images[0]} />
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
                <Col lg={3} md={3} xs={4}>
                    <Card key={song.uri} className="card">
                        <h5>
                            <a href={song.external_urls.spotify} target="_blank">
                                <img className="song-image" src="http://cdn.onlinewebfonts.com/svg/img_82197.png"/>
                                {song.name}
                            </a>
                        </h5>
                    </Card>
                </Col>
            );
        });
    }

    function average(array) {
        return array.reduce((a, b) => a + b) / array.length;
    }

    // background color ranges from 0.0 to 1.0, will correspond to energy (purple == highest energy)
    // now returning a gradient from lowest to average to highest energy colors
    function computeBackgroundColor() {
        const colors = ["#F94144", "#F8961E", "#F9C74F", "#55A630", "#00AFB9", "#0077B6", "#8E7DBE"];
        let energyArray = audioFeatures.map(item => item.energy);
        let averageIndex = Math.round(6*average(energyArray));
        let lowestIndex = Math.round(6*Math.min(...energyArray));
        let highestIndex = Math.round(6*Math.max(...energyArray));
        let gradient = "linear-gradient(90deg, " + colors[lowestIndex] + ", " + colors[averageIndex] + ", " + colors[highestIndex] + ")";
        return gradient;
    }

    // background opacity ranges from 0.0 to 1.0, loudness ranges from about -65 to 0 decibels, so 1.0 opacity == loud
    function computeBackgroundOpacity() {
        let loudnessArray = audioFeatures.map(item => item.loudness);
        let averageLoudness = average(loudnessArray);
        return (averageLoudness + 65) * (1/65);
    }

    // songs mostly in major key (1) = lighter color, songs mostly in minor key (0) = darker color
    function computeCatColor() {
        let modeArray = audioFeatures.map(item => item.mode);
        let averageMode = average(modeArray);
        if (Math.round(averageMode) === 1) return "#fefae0";
        else return "#432818";
    }

    // assumed bpm range of 0-200, will map to a 0-4 second interval
    function computeTongueAnimationSpeed() {
        let tempoArray = audioFeatures.map(item => item.tempo);
        let averageTempo = average(tempoArray);
        return averageTempo * (4/200);
    }

    // danceability ranges from 0 (least) to 1 (most), will map to a 0-4 second interval
    function computeEarAnimationSpeed() {
        let danceabilityArray = audioFeatures.map(item => item.danceability);
        return Math.round(average(danceabilityArray) * 4);
    }

    // duration of songs will map to length of whiskers
    function computeWhiskerLength() {
        const lengths = ["50px", "60px", "70px", "80px", "90px", "100px"]
        let durationArray = audioFeatures.map(item => item.duration_ms);
        let averageDuration = Math.round(average(durationArray));
        let index = averageDuration % 6;
        return lengths[index];
    }

    function explanationTooltip(explanation) {
        return (
            <Tooltip>{explanation}</Tooltip>
        );
    }

    function displayCatVis() {
        if (audioFeatures.length) {
            const containerCss = {
                background:  computeBackgroundColor(),
                opacity: computeBackgroundOpacity()
            };
            const headCss = {
                borderRadius: "50%",
                width: "200px",
                height: "200px",
                margin: "1% auto",
                backgroundColor: computeCatColor()
            };
            const leftEarCss = {
                width: 0,
                height: 0, 
                borderLeft: "30px solid transparent",
                borderRight: "30px solid transparent",
                borderTop: "50px solid " + computeCatColor(),
                position: "relative",
                top: "-10%",
                left: "-5%",
                display: "inline-block",
                animation: "ear-animation infinite "+ computeEarAnimationSpeed() +"s both"
            };
            const rightEarCss = {
                width: 0,
                height: 0, 
                borderLeft: "30px solid transparent",
                borderRight: "30px solid transparent",
                borderTop: "50px solid " + computeCatColor(),
                position: "relative",
                top: "-10%",
                left: "45%",
                display: "inline-block",
                animation: "ear-animation infinite "+ computeEarAnimationSpeed() +"s both"
            };
            const tongueCss = {
                position: "relative", 
                top: "35%",
                left: "50%",
                width: "20px",
                height: "20px",
                backgroundColor: "#ffb4a2",
                borderBottomLeftRadius: "30%",
                borderBottomRightRadius: "30%",
                animation: "tongue-animation infinite "+ computeTongueAnimationSpeed() +"s both"
            };
            const whisker1 = {
                backgroundColor: "black",
                height: "2px",
                width: computeWhiskerLength(),
                position: "relative", 
                top: "20%",
                left: "-10%"
            };
            const whisker2 = {
                backgroundColor: "black",
                height: "2px",
                width: computeWhiskerLength(),
                position: "relative", 
                top: "25%",
                left: "-10%"
            };
            const whisker3 = {
                backgroundColor: "black",
                height: "2px",
                width: computeWhiskerLength(),
                position: "relative", 
                top: "17%",
                left: "80%"
            };
            const whisker4 = {
                backgroundColor: "black",
                height: "2px",
                width: computeWhiskerLength(),
                position: "relative", 
                top: "22%",
                left: "80%"
            };

            const tongueExplanation = "The animation speed is based on the average tempo of your top 10 songs (higher bpm = faster animation)";
            const backgroundExplanation = "Color gradient is based on the min, avg, and max energy values of your top 10 songs (purple = high energy)" +
                " Opacity is based on the average loudness of your top 10 songs (solid = louder)";
            const headExplanation = "The color of your cat is based on whether more of your top 10 songs are in major or minor key (major = cream cat, minor = chocolate cat)";
            const earsExplanation = "The animation speed is based on the average danceability of your top 10 songs (more danceable = faster animation)";
            const whiskersExplanation = "The whisker length is based on the average duration of your top 10 songs";
            return (
                <Col>
                    <Row>
                        <div id="cat-container" style={containerCss}>
                            <div id="head" style={headCss}>
                                <div id="left-eye" />
                                <div id="right-eye" />
                                <div id="nose" />
                                
                                <div id="left-ear" style={leftEarCss} />
                                <div id="right-ear" style={rightEarCss} />
                            
                            
                                <div id="whisker1" style={whisker1} />
                                <div id="whisker2" style={whisker2} />
                                <div id="whisker3" style={whisker3} />
                                <div id="whisker4" style={whisker4} />

                                <div id="tongue" style={tongueCss} />
                            </div>
                        </div>
                    </Row>
                    <Row className="explanations">
                        <Col>
                            <OverlayTrigger placement="bottom" overlay={explanationTooltip(backgroundExplanation)}>
                                <Card className="card">
                                    <Card.Title>Background</Card.Title>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                        <Col>
                            <OverlayTrigger placement="bottom" overlay={explanationTooltip(headExplanation)}>
                                <Card className="card">
                                    <Card.Title>Cat Color</Card.Title>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                        <Col>
                            <OverlayTrigger placement="bottom" overlay={explanationTooltip(tongueExplanation)}>
                                <Card className="card">
                                    <Card.Title>Tongue</Card.Title>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                        <Col>
                            <OverlayTrigger placement="bottom" overlay={explanationTooltip(earsExplanation)}>
                                <Card className="card">
                                    <Card.Title>Ears</Card.Title>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                        <Col>
                            <OverlayTrigger placement="bottom" overlay={explanationTooltip(whiskersExplanation)}>
                                <Card className="card">
                                    <Card.Title>Whiskers</Card.Title>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Col>
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

            <Row><h4 style={{textAlign: "center", margin: " 1% auto"}}>Cat visualization created based on your top songs</h4></Row>
            <Row>{displayCatVis()}</Row>
            
            <Row><h4>Your Top 10 Artists</h4></Row>
            <Row className="cards-container">{ topArtists !== {} ? displayTopArtists() : <p>Loading top artists...</p> }</Row>

            <Row><h4>Your Top 10 Songs</h4></Row>
            <Row className="cards-container">{ topTracks !== {} ? displayTopTracks() : <p>Loading top tracks...</p> }</Row>
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
