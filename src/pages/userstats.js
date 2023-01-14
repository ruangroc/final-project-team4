/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {
  Container,
  Row,
  Col,
  Card,
  Tooltip,
  OverlayTrigger,
  Button,
  ButtonGroup,
  Jumbotron,
} from "react-bootstrap";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { getAuth } from "../redux/selectors";
import { get } from "../utils/api";
import { useState, useEffect } from "react";

import Login from "../components/login";

// next: add variable nose color, include the actual numbers in the tooltips

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
    h6 {
      padding: 5px;
      margin: 1%;
    }
    .song-image {
      width: 8%;
      margin: 1%;
    }
    .card {
      background-color: #3be378;
      height: 100%;
      width: 100%;
      text-align: center;
      color: black;
    }
    .cards-container {
      padding-left: 1%;
      padding-right: 1%;
    }
    .centered {
      margin: 1% auto;
      text-align: center;
      justify-content: center;
    }
    .active-button {
      background-color: #3be378;
      height: 100%;
      width: 100%;
      text-align: center;
      color: white;
    }
    #cat-container {
      width: 90%;
      height: 100%;
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
      width: 85%;
      margin: 1% auto;
    }
    @keyframes tongue-animation {
      0% {
        height: 0%;
      }
      10% {
        height: 1%;
      }
      20% {
        height: 2%;
      }
      30% {
        height: 3%;
      }
      40% {
        height: 4%;
      }
      50% {
        height: 5%;
      }
      60% {
        height: 6%;
      }
      70% {
        height: 7%;
      }
      80% {
        height: 8%;
      }
      90% {
        height: 9%;
      }
      100% {
        height: 10%;
      }
    }
    @keyframes ear-animation {
      0% {
        transform: rotate(-10deg);
      }
      25% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(10deg);
      }
      75% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(-10deg);
      }
    }
  `;

  const [topArtists, setTopArtists] = useState({});
  const [topTracks, setTopTracks] = useState({});
  const [audioFeatures, setAudioFeatures] = useState({});
  const [dataTimeframe, setDataTimeframe] = useState("short_term");

  const auth = useSelector(getAuth);
  const loggedIn = auth.loggedIn;

  useEffect(() => {
    // console.log("access token:", auth.accessToken);
    if (loggedIn) {
      fetchTopArtists();
      fetchTopTracks();
    } else {
      console.log("not logged in!");
    }
  }, [loggedIn, dataTimeframe]);

  useEffect(() => {
    if (topTracks !== {}) fetchAudioFeatures();
  }, [topTracks]);

  async function fetchAudioFeatures() {
    try {
      const trackIds = topTracks.items.map((song) => song.id).join();
      const url = `https://api.spotify.com/v1/audio-features?ids=${trackIds}`;
      let result = await get(url, { access_token: auth.accessToken });
      // console.log("fetch audio features:", result.audio_features);
      setAudioFeatures(result.audio_features || {});
    } catch (e) {
      if (e instanceof DOMException) {
        console.log("HTTP Request Aborted");
      }
      console.log("error fetching audio features", e);
    }
  }

  async function fetchTopArtists() {
    try {
      const url = `https://api.spotify.com/v1/me/top/artists?time_range=${dataTimeframe}`;
      let result = await get(url, { access_token: auth.accessToken });
      setTopArtists(result || {});
    } catch (e) {
      if (e instanceof DOMException) {
        console.log("HTTP Request Aborted");
      }
      console.log("error fetching top artists", e);
    }
  }

  async function fetchTopTracks() {
    try {
      const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${dataTimeframe}`;
      let result = await get(url, { access_token: auth.accessToken });
      setTopTracks(result || {});
    } catch (e) {
      if (e instanceof DOMException) {
        console.log("HTTP Request Aborted");
      }
      console.log("error fetching top tracks", e);
    }
  }

  function displayTopArtists() {
    if (topArtists.items === undefined) {
      return <p>Loading top artists...</p>;
    }
    return topArtists.items.slice(0, 10).map((artist) => {
      if (artist) {
        return (
          <Col xl={1} lg={2} md={2} xs={6}>
            <Card key={artist.uri} className="card">
              <Card.Img
                src={
                  artist.images && artist.images.length >= 1 && artist.images[0]
                    ? artist.images[0].url
                    : "https://tse2.mm.bing.net/th?id=OIP.Z0UUFwBFho8rhsr3Z8kMJQHaHa&pid=Api"
                }
              />
              <h6>
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  {artist.name}
                </a>
              </h6>
            </Card>
          </Col>
        );
      }
    });
  }

  function displayTopTracks() {
    if (topTracks.items === undefined) {
      return <p>Loading top tracks...</p>;
    }
    return (
      <Col>
        <Row className="centered">
          {topTracks.items.slice(0, 5).map((song) => {
            if (song) {
              return (
                <Col xs={12} md={8} lg={2}>
                  <Card
                    key={song.uri}
                    className="card"
                    style={{ textAlign: "left" }}
                  >
                    <h6>
                      <a
                        href={song.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          className="song-image"
                          alt=""
                          src="http://cdn.onlinewebfonts.com/svg/img_82197.png"
                        />
                        {song.name}
                      </a>
                    </h6>
                  </Card>
                </Col>
              );
            }
          })}
        </Row>
        <Row className="centered">
          {topTracks.items.slice(5, 10).map((song) => {
            if (song) {
              return (
                <Col xs={12} md={8} lg={2}>
                  <Card
                    key={song.uri}
                    className="card"
                    style={{ textAlign: "left" }}
                  >
                    <h6>
                      <a
                        href={song.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          className="song-image"
                          alt=""
                          src="http://cdn.onlinewebfonts.com/svg/img_82197.png"
                        />
                        {song.name}
                      </a>
                    </h6>
                  </Card>
                </Col>
              );
            }
          })}
        </Row>
      </Col>
    );
  }

  function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
  }

  // background color ranges from 0.0 to 1.0, will correspond to energy (purple == highest energy)
  // now returning a gradient from lowest to average to highest energy colors
  function computeBackgroundColor() {
    const colors = [
      "#F94144",
      "#F8961E",
      "#F9C74F",
      "#55A630",
      "#00AFB9",
      "#0077B6",
      "#8E7DBE",
    ];
    let energyArray = audioFeatures.map((item) => item.energy);
    let averageIndex = Math.round(6 * average(energyArray));
    let lowestIndex = Math.round(6 * Math.min(...energyArray));
    let highestIndex = Math.round(6 * Math.max(...energyArray));
    let gradient =
      "linear-gradient(90deg, " +
      colors[lowestIndex] +
      ", " +
      colors[averageIndex] +
      ", " +
      colors[highestIndex] +
      ")";
    return gradient;
  }

  // background opacity ranges from 0.0 to 1.0, loudness ranges from about -65 to 0 decibels, so 1.0 opacity == loud
  function computeBackgroundOpacity() {
    let loudnessArray = audioFeatures.map((item) => item.loudness);
    let averageLoudness = average(loudnessArray);
    return (averageLoudness + 65) * (1 / 65);
  }

  // songs mostly in major key (1) = lighter color, songs mostly in minor key (0) = darker color
  function computeCatColor() {
    let modeArray = audioFeatures.map((item) => item.mode);
    let averageMode = average(modeArray);
    if (Math.round(averageMode) === 1) return "#fefae0";
    else return "#432818";
  }

  // assumed bpm range of 0-200, will map to a 0-4 second interval
  function computeTongueAnimationSpeed() {
    let tempoArray = audioFeatures.map((item) => item.tempo);
    let averageTempo = average(tempoArray);
    return averageTempo * (4 / 200);
  }

  // danceability ranges from 0 (least) to 1 (most), will map to a 0-4 second interval
  function computeEarAnimationSpeed() {
    let danceabilityArray = audioFeatures.map((item) => item.danceability);
    return Math.round(average(danceabilityArray) * 4);
  }

  // duration of songs will map to length of whiskers
  function computeWhiskerLength() {
    const lengths = ["50px", "60px", "70px", "80px", "90px", "100px"];
    let durationArray = audioFeatures.map((item) => item.duration_ms);
    let averageDuration = Math.round(average(durationArray));
    let index = averageDuration % 6;
    return lengths[index];
  }

  function explanationTooltip(explanation) {
    return <Tooltip>{explanation}</Tooltip>;
  }

  function catVisTooltips() {
    const tooltipTitles = [
      "Background Colors",
      "Background Opacity",
      "Cat Color",
      "Tongue",
      "Ears",
      "Whiskers",
    ];

    let energyArray = audioFeatures.map((item) => item.energy);
    let averageEnergy = average(energyArray).toFixed(2);
    let minEnergy = Math.min(...energyArray).toFixed(2);
    let maxEnergy = Math.max(...energyArray).toFixed(2);
    const background =
      "Color gradient is based on the min, avg, and max energy values of your top 10 songs (purple = high energy, red = low energy)." +
      "\nYour min: " +
      minEnergy +
      " avg: " +
      averageEnergy +
      " max: " +
      maxEnergy;

    let averageOpacity = average(
      audioFeatures.map((item) => item.loudness)
    ).toFixed(2);
    const opacity =
      " Opacity is based on the average loudness of your top 10 songs (solid = louder). Your average song loudness: " +
      -1 * averageOpacity;

    let averageKey = average(audioFeatures.map((item) => item.mode)).toFixed(2);
    const catColor =
      "The color of your cat is based on whether more of your top 10 songs are in major or minor key (major = cream cat, minor = chocolate cat)." +
      " \nYour average song key: " +
      averageKey;

    let averageTempo = average(audioFeatures.map((item) => item.tempo)).toFixed(
      2
    );
    const tongue =
      "The animation speed is based on the average tempo of your top 10 songs (higher bpm = faster animation). \nYour average song tempo: " +
      averageTempo;

    let averageDanceability = average(
      audioFeatures.map((item) => item.danceability)
    ).toFixed(2);
    const ears =
      "The animation speed is based on the average danceability of your top 10 songs ( 1 = more danceable = faster animation)." +
      " \nYour average song danceability: " +
      averageDanceability;

    let averageDuration = (
      average(audioFeatures.map((item) => item.duration_ms)) / 1000
    ).toFixed(2);
    const whiskers =
      "The whisker length is based on the average duration of your top songs. \nYour average song duration: " +
      averageDuration +
      " seconds";
    const explanations = [
      background,
      opacity,
      catColor,
      tongue,
      ears,
      whiskers,
    ];
    return (
      <Row className="explanations">
        <Col>
          <Row className="centered">
            {tooltipTitles.slice(0, 3).map((title, i) => {
              return (
                <Col xs={12} md={4}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={explanationTooltip(explanations[i])}
                  >
                    <Card className="card">
                      <h6>{title}</h6>
                    </Card>
                  </OverlayTrigger>
                </Col>
              );
            })}
          </Row>
          <Row className="centered">
            {tooltipTitles.slice(3, 6).map((title, i) => {
              return (
                <Col xs={12} md={4}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={explanationTooltip(explanations[i + 3])}
                  >
                    <Card className="card">
                      <h6>{title}</h6>
                    </Card>
                  </OverlayTrigger>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    );
  }

  function displayCatVis() {
    if (audioFeatures.length) {
      const containerCss = {
        background: computeBackgroundColor(),
        opacity: computeBackgroundOpacity(),
      };
      const headCss = {
        borderRadius: "50%",
        width: "200px",
        height: "200px",
        margin: "1% auto",
        backgroundColor: computeCatColor(),
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
        animation:
          "ear-animation infinite " + computeEarAnimationSpeed() + "s both",
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
        animation:
          "ear-animation infinite " + computeEarAnimationSpeed() + "s both",
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
        animation:
          "tongue-animation infinite " +
          computeTongueAnimationSpeed() +
          "s both",
      };
      const whisker1 = {
        backgroundColor: "black",
        height: "2px",
        width: computeWhiskerLength(),
        position: "relative",
        top: "20%",
        left: "-10%",
      };
      const whisker2 = {
        backgroundColor: "black",
        height: "2px",
        width: computeWhiskerLength(),
        position: "relative",
        top: "25%",
        left: "-10%",
      };
      const whisker3 = {
        backgroundColor: "black",
        height: "2px",
        width: computeWhiskerLength(),
        position: "relative",
        top: "17%",
        left: "80%",
      };
      const whisker4 = {
        backgroundColor: "black",
        height: "2px",
        width: computeWhiskerLength(),
        position: "relative",
        top: "22%",
        left: "80%",
      };

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
          {catVisTooltips()}
        </Col>
      );
    }
    return <p>Loading cat visualization...</p>;
  }

  function displayTimeframeButtons() {
    return (
      <Col xs={11} md={8} lg={8}>
        <ButtonGroup style={{ width: "100%" }}>
          <OverlayTrigger
            placement="bottom"
            overlay={explanationTooltip("The last 4 weeks")}
          >
            <Button
              className={
                dataTimeframe === "short_term" ? "active-button" : "card"
              }
              onClick={() => {
                setDataTimeframe("short_term");
              }}
            >
              <h6 className="centered">Short Term</h6>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={explanationTooltip("The last 6 months")}
          >
            <Button
              className={
                dataTimeframe === "medium_term" ? "active-button" : "card"
              }
              onClick={() => {
                setDataTimeframe("medium_term");
              }}
            >
              <h6 className="centered">Medium Term</h6>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={explanationTooltip("All data")}
          >
            <Button
              className={
                dataTimeframe === "long_term" ? "active-button" : "card"
              }
              onClick={() => {
                setDataTimeframe("long_term");
              }}
            >
              <h6 className="centered">Long Term</h6>
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      </Col>
    );
  }

  return (
    <>
      <Navigation />
      <Container>
        <br></br>
        <Jumbotron style={{ textAlign: "center" }}>
          <h1 class="display-4">Your Spotify Purrsona</h1>
          <p class="lead">
            Have a cat visualization created based on your spotify data!
          </p>
        </Jumbotron>
      </Container>
      {loggedIn ? (
        <Container fluid css={styles}>
          <Row>
            <h4 className="centered">Select timeframe for data:</h4>
          </Row>
          <Row className="centered">
            <Col></Col>
            {displayTimeframeButtons()}
            <Col></Col>
          </Row>

          <Row>
            <h4 className="centered">
              Cat visualization created based on your top songs
            </h4>
          </Row>
          <Row>{displayCatVis()}</Row>

          <Row>
            <h4 className="centered">Your Top 10 Artists</h4>
          </Row>
          <Row className="cards-container centered">
            {topArtists !== {} ? (
              displayTopArtists()
            ) : (
              <p>Loading top artists...</p>
            )}
          </Row>

          <Row>
            <h4 className="centered">Your Top 10 Songs</h4>
          </Row>
          <Row className="cards-container centered">
            {topTracks !== {} ? (
              displayTopTracks()
            ) : (
              <p>Loading top tracks...</p>
            )}
          </Row>
        </Container>
      ) : (
        <Container fluid css={styles}>
          <Login />
        </Container>
      )}
    </>
  );
}
