/**@jsxImportSource @emotion/react */
import Navigation from "../components/navbar";
import {
  Row,
  Col,
  Card,
  Tooltip,
  OverlayTrigger,
  Button,
  ButtonGroup,
  Jumbotron,
  Tabs,
  Tab,
} from "react-bootstrap";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { getAuth } from "../redux/selectors";
import { get } from "../utils/api";
import { useState, useEffect } from "react";
import { isEqual } from "lodash";
import Login from "../components/login";

export default function UserStats() {
  const styles = css`
    a {
      color: black;
    }
    h4 {
      margin: 1%;
    }

    h6 {
      padding: 5px;
      margin: 1%;
    }
    .card-image {
      object-fit: cover;
      width: 70px;
      height: 70px;
      padding: 5px;
      opacity: 0.6;
      float: left;
    }

    .card-image-selected {
      object-fit: cover;
      width: 70px;
      height: 70px;
      opacity: 1;
      padding: 5px;
      float: left;
    }

    .card {
      background-color: #e7f2f8;
      height: 100%;
      width: 100%;
      text-align: left;
      color: black;
    }

    .cardImgArtist {
      float: left;
      object-fit: cover;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      padding: 5px;
      float: left;
      opacity: 0.9;
    }

    .cards-container {
      padding-left: 1%;
      padding-right: 1%;
      list-style: none;
    }
    .centered {
      margin: 1% auto;
      text-align: center;
      justify-content: center;
    }
    .active-button {
      background-color: #84a59d;
      height: 100%;
      width: 100%;
      text-align: center;
      color: white;
    }
    #cat-container {
      min-width: 600px;
      min-height: 800px;
      width: 100%;
      height: 100%;
      margin: 0px;
      padding: 0px;
      position: static;
    }
    #left-eye {
      width: 15px;
      height: 20px;
      border-radius: 50%;
      position: absolute;
      top: 43%;
      left: 28%;
      background-color: black;
      margin: 0px;
      display: inline-block;
    }

    #right-eye {
      width: 15px;
      height: 20px;
      border-radius: 50%;
      position: absolute;
      top: 43%;
      left: 67%;
      background-color: black;
      margin: 0px;
      display: inline-block;
    }
    #left-cheek {
      width: 30px;
      height: 22px;
      border-radius: 50%;
      position: absolute;
      top: 55%;
      left: 12%;
      background-color: pink;
      margin: 0px;
      display: inline-block;
      opacity: 0.7;
    }
    #right-cheek {
      width: 30px;
      height: 22px;
      border-radius: 50%;
      position: absolute;
      top: 55%;
      left: 73%;
      background-color: pink;
      opacity: 0.7;
      margin: 0px;
      display: inline-block;
    }
    #nose {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #000;
      position: absolute;
      top: 65%;
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
  const [songPlaying, setSongPlaying] = useState({});

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
          <li>
            <Card key={artist.uri} className="card">
              <div>
                <img
                  className="cardImgArtist"
                  src={
                    artist.images &&
                    artist.images.length >= 1 &&
                    artist.images[0]
                      ? artist.images[0].url
                      : "https://tse2.mm.bing.net/th?id=OIP.Z0UUFwBFho8rhsr3Z8kMJQHaHa&pid=Api"
                  }
                />
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h6>{artist.name}</h6>
                </a>
              </div>
            </Card>
          </li>
        );
      }
    });
  }

  function playMusic(song) {
    let s = new Audio(song.preview_url);
    if (isEqual(songPlaying.src, s.src) == true) {
      songPlaying.pause();
      setSongPlaying({});
      return;
    } else if (isEqual(songPlaying, {}) == false) {
      songPlaying.pause();
      setSongPlaying({});
    }
    setSongPlaying(s);
    s.play();
  }

  function displayTopTracks() {
    if (topTracks.items === undefined) {
      return <p>Loading top tracks...</p>;
    }
    return (
      <>
        {topTracks.items.slice(0, 10).map((song) => {
          if (song) {
            return (
              <li>
                <Card key={song.uri} className="card">
                  <div>
                    <img
                      className={
                        songPlaying.src === song.preview_url
                          ? "card-image-selected"
                          : "card-image"
                      }
                      alt=""
                      src={song.album.images[0].url}
                      onClick={() => {
                        playMusic(song);
                      }}
                    />
                    <a
                      href={song.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <h6>{song.name} </h6>
                      by {song.artists[0].name}
                    </a>
                  </div>
                </Card>
              </li>
            );
          }
        })}
      </>
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
    const colors = [
      "#201F1D",
      "#403d39",
      "#8f7d6f",
      "#dea369",
      "#ead4b4",
      "#ffe1a8",
      "#fefae0",
      "#ffffff",
    ];
    let valenceArray = audioFeatures.map((item) => item.valence);
    let index = Math.round(7 * average(valenceArray));
    return colors[index];
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
      "*",
      "Background Colors",
      "Background Opacity",
      "Color",
      "Tongue",
      "Ears",
      "Whiskers",
    ];
    if (isEqual(audioFeatures, {})) {
      return <p>Loading</p>;
    }

    let energyArray = audioFeatures.map((item) => item.energy);
    let averageEnergy = average(energyArray).toFixed(2);
    let minEnergy = Math.min(...energyArray).toFixed(2);
    let maxEnergy = Math.max(...energyArray).toFixed(2);

    const home =
      "Curious about your cat? Learn more by clicking the attributes. ";
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

    let averageKey = average(audioFeatures.map((item) => item.valence)).toFixed(
      2
    );
    const catColor =
      "The color of your cat is based on the average valence of your top ten songs. Valence describes the musical positiveness conveyed by a track. High valence tracks sound more positive while tracks with low valence sound more negative." +
      " \nYour average song valence: " +
      averageKey;

    let averageTempo = average(
      audioFeatures.map((item) => item.valence)
    ).toFixed(2);
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
      home,
      background,
      opacity,
      catColor,
      tongue,
      ears,
      whiskers,
    ];

    return (
      <div
        style={{
          margin: "10px",
          padding: "15px",
          border: "1px solid #d3d3d3",
          borderRadius: "20px",
        }}
      >
        <h4> Cat Characteristics </h4>

        <br></br>

        <Tabs>
          {tooltipTitles.map((title, i) => {
            return (
              <Tab
                eventKey={title}
                title={title}
                style={{ paddingTop: "10px" }}
              >
                <blockquote>{explanations[i]}</blockquote>
              </Tab>
            );
          })}
        </Tabs>
      </div>
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
        margin: "100px auto",
        backgroundColor: computeCatColor(),
        position: "absolute",
        left: "35%"
      };
      const leftEarCss = {
        width: 0,
        height: 0,
        borderLeft: "30px solid transparent",
        borderRight: "30px solid transparent",
        borderTop: "50px solid " + computeCatColor(),
        borderRadius: "8px",
        position: "absolute",
        top: "15%",
        left: "-10%",
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
        borderRadius: "8px",
        position: "absolute",
        top: "15%",
        left: "80%",
        display: "inline-block",
        animation:
          "ear-animation infinite " + computeEarAnimationSpeed() + "s both",
      };
      const tongueCss = {
        position: "absolute",
        top: "80%",
        left: "45%",
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
        height: "1px",
        width: computeWhiskerLength(),
        position: "absolute",
        top: "65%",
        left: "-23%",
      };
      const whisker2 = {
        backgroundColor: "black",
        height: "1px",
        width: computeWhiskerLength(),
        position: "absolute",
        top: "70%",
        left: "-20%",
      };
      const whisker3 = {
        backgroundColor: "black",
        height: "1px",
        width: computeWhiskerLength(),
        position: "absolute",
        top: "65%",
        left: "90%",
      };
      const whisker4 = {
        backgroundColor: "black",
        height: "1px",
        width: computeWhiskerLength(),
        position: "absolute",
        top: "70%",
        left: "87%",
      };

      return (
        <div id="cat-container" style={containerCss}>
          <Jumbotron>
            <h1 class="display-4">Your Purrsona</h1>
            <p class="lead">
              Have a cat visualization created based on your spotify data!
            </p>
            <p>Select a time frame to see how your music taste has changed</p>
            {displayTimeframeButtons()}
          </Jumbotron>

          <div id="head" style={headCss}>
            <div id="left-eye" />
            <div id="right-eye" />
            <div id="left-cheek" />
            <div id="right-cheek" />
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
      );
    }
    return <p>Loading cat visualization...</p>;
  }

  function displayTimeframeButtons() {
    return (
      <ButtonGroup>
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
            <h6 className="centered">Short </h6>
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
            <h6 className="centered">Medium </h6>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          overlay={explanationTooltip("All data")}
        >
          <Button
            className={dataTimeframe === "long_term" ? "active-button" : "card"}
            onClick={() => {
              setDataTimeframe("long_term");
            }}
          >
            <h6 className="centered">Long</h6>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    );
  }

  return (
    <>
      <Navigation />

      <Row css={styles}>
        <Col style={{ backgroundColor: "white" }}>
          {loggedIn ? (
            displayCatVis()
          ) : (
            <>
              <Jumbotron>
                <h1 class="display-3">Your Purrsona</h1>
                <p class="lead">
                  Have a cat visualization created based on your spotify data!
                </p>
              </Jumbotron>
            </>
          )}
        </Col>
        <Col>
          {loggedIn ? (
            <>
              <Row>{catVisTooltips()}</Row>
              <Row>
                <Col>
                  <h4 className="centered"> Top Songs </h4>
                  <ul className="cards-container">
                    {topTracks !== {} ? (
                      displayTopTracks()
                    ) : (
                      <p>Loading top tracks...</p>
                    )}
                  </ul>
                </Col>
                <Col>
                  <h4 className="centered"> Top Artists </h4>
                  <ul className="cards-container">
                    {topArtists !== {} ? (
                      displayTopArtists()
                    ) : (
                      <p>Loading top artists...</p>
                    )}
                  </ul>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Login />
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
