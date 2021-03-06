/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';
import { get, post } from '../utils/api';
import scopes from '../utils/scopes';
import Dropdown from '../components/Dropdown';

// Spotify Auth package
import { SpotifyAuth } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css' // if using the included styles


function CombinePlaylists() {

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;
    const [playlists, setPlaylists] = useState({ selectedPlaylist1: '', selectedPlaylist2: '', playlistList: [] });

    /**
     * Fetches playlists for the signed in user
     */
    async function fetchMyPlaylists() {
        try {
            const url = `https://api.spotify.com/v1/me/playlists`;
            const result = await get(url, { access_token: auth.accessToken });
            console.log("fetch my user playlists:", result);
            setPlaylists({
                playlistList: result.items
            });
        } catch (e) {
            if (e instanceof DOMException) {
                console.log("HTTP Request Aborted")
            }
            console.log("error fetching playlists", e);
        }
    }

    /**
     * Fetch 100 songs from a playlist, starting at the offset (ex. offset = 100, get the next 100 songs after the 100th song)
     * @param {} playlistId 
     * @param {*} offset 
     * @returns 
     */
    async function fetchPlaylistSongs(playlistId, offset) {
        try {
            const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?&offset=${offset}`;
            const results = await get(url, { access_token: auth.accessToken });
            return results;

        } catch (e) {
            if (e instanceof DOMException) {
                console.log("HTTP Request Aborted")
            }
            console.log("error fetching playlists", e);
        }
    }

    /**
     * Retrieve songs from a playlist with over 100 songs. The Spotify API will only return 100 songs at a time, so multiple calls need to be made.
     * We can specify an offset in which to start getting song data from c
     * @param {*} playlistId : id of playlist to retrieve songs from
     * @param {*} offsets : contain the offsets in which to start getting song data
     * @returns 
     */
    async function callAllPromises(playlistId, offsets) {
        let allSongs = [];

        const promises = offsets.map(async offset => {
            const result = await fetchPlaylistSongs(playlistId, offset);
            return result;
        });
        
        const allPromises = await Promise.all(promises);
        
        allPromises.forEach(playlistFetch => { 
            allSongs = [...allSongs, ...playlistFetch.items];
        })

        return allSongs;
    }

    /**
     * Fetch all songs from a playlist. 
     * If a playlist has more than 100 songs, calls callAllPromises where multiple calls to fetchPlaylistSongs need to be made since the Spotify API will only return 100 songs at a time.
     * @param {*} playlistId : id of the playlist to retrieve tracks from
     * @returns all songs from a playlist
     */
    async function fetchAllPlaylistSongs(playlistId) {
        try {
            const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
            let results = await get(url, { access_token: auth.accessToken });    
                
            // if playlist has less than 100 songs, we don't need to make more API calls
            if(results.total <= 100) {
                return results.items;
            }

            // else, we need to make extra API calls
            else {
                // number of calls we need to make to fetchPlaylistSongs since we can only get 100 songs at a time
                const numCalls = Math.floor(results.total / 100); 

                var offsets = [];

                for (var i = 0; i <= numCalls; i++) {
                    offsets.push(i * 100);
                }

                return callAllPromises(playlistId, offsets);
            }

        } catch (e) {
            if (e instanceof DOMException) {
                console.log("HTTP Request Aborted")
            }
            console.log("error fetching playlists", e);
        }
    }

    /**
     * Add tracks to a playlist
     * @param {} playlistId : id of playlist to add songs into
     * @param {*} playlistUris : list of song URIs to into the playlist
     */
    async function addTracksToPlaylist(playlistId, playlistUris) {

        let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${playlistUris[0]}`;

        // append playlist URIs to url
        for(var i = 1; i < playlistUris.length; i++) {
            url += `%2C${playlistUris[i]}`;
        }

        const results = await post(url, { access_token: auth.accessToken });
        console.log('Playlist combine POST results: ', results);
        if(results.status === 201) {
            alert("Missing songs from playlist 1 successfully added into playlist 2!");
        }
        else {
            alert("Something went wrong, please try again!");
        }
    }

    /**
     * Merge all missing songs from playlist 1 into playlist 2
     */
    async function combinePlaylists() {
        
        // check if playlists are empty
        if (playlists.selectedPlaylist1 === undefined || playlists.selectedPlaylist2 === undefined) {
            alert("Please choose 2 playlists.");
        }

        // fetch songs from playlists
        const p1Tracks = await fetchAllPlaylistSongs(playlists.selectedPlaylist1);
        const p2Tracks = await fetchAllPlaylistSongs(playlists.selectedPlaylist2);
        
        // find all the missing songs from playlist 2 to add into playlist 1
        let p1TrackMap = new Map();
        let missingSongs = [];

        p1Tracks.forEach(song => {
            p1TrackMap.set(song.track.uri, 1);
        })

        p2Tracks.forEach(song => {
            if(!p1TrackMap.has(song.track.uri)) {
                missingSongs.push(song.track.uri);
            }
        });

        // make sure that there are actually missing songs to add
        if (missingSongs.length <= 0) {
            alert('All songs from playlist 1 are already in playlist 2!');
            return;
        }

        addTracksToPlaylist(playlists.selectedPlaylist1, missingSongs);
    }

    useEffect(() => {
        if (loggedIn) {
            fetchMyPlaylists();
        }
    }, [loggedIn]);

    const changePlaylist1 = e => {
        setPlaylists({
            ...playlists,
            selectedPlaylist1: e.target.value
        });
    }

    const changePlaylist2 = e => {
        setPlaylists({
            ...playlists,
            selectedPlaylist2: e.target.value
        });
    } 

    const styles = css`
    .row {
        text-align: center;
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .card {
        width: 100%;
        height: 100%;
        background-color: #3BE378;
    }

    a {
        color: black;
    }
`;

    return (
        <>
        <Navigation/>
        <Container fluid css={styles}>
            <Row>
                <Col>
                    <h1> Combine your playlists!</h1>
                </Col>
            </Row>

                    {loggedIn ? (
                        <>
                        <Row>
                            <Col>
                            <h3>Merge all songs from playlist 2 into playlist 1 </h3>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col>
                            <h2> Playlist 1</h2>
                            <Dropdown
                                options={playlists.playlistList}
                                value={playlists.selectedPlaylist1}
                                change={changePlaylist1}
                            />
                            </Col>
                            <Col>
                            <h1> ADD ARROW HERE </h1>
                            
                            </Col>
                            <Col>
                            <h2> Playlist 2</h2>
                            <Dropdown 
                                options={playlists.playlistList}
                                value={playlists.selectedPlaylist2}
                                change={changePlaylist2}
                            />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="outline-success" onClick={combinePlaylists}>
                                    Combine!
                                </Button>
                            </Col>
                        </Row>
                        </> 
                    ) : (
                        <Row>
                            <Col>

                            <div>
                                <h5>Please login to use this feature!</h5>
                                <SpotifyAuth
                                    redirectUri='http://localhost:3000/redirect'
                                    clientID='164e3321d4714ea2b1d88976aeecb258'
                                    scopes={scopes}
                                />
                            </div>
                            </Col>
                        </Row>
                        )}

        </Container>
    </>
    );
  }

  export default CombinePlaylists;