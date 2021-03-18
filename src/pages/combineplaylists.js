/**@jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import Navigation from "../components/navbar";
import { Container, Row, Col, Button, Jumbotron } from 'react-bootstrap';
import { css } from '@emotion/react';
import styled from '@emotion/styled/macro';
import { useSelector } from 'react-redux';
import { getAuth } from '../redux/selectors';
import { get, post } from '../utils/api';
import scopes from '../utils/scopes';
import Dropdown from '../components/Dropdown';

import Login from '../components/login';

const CombineSuccess = styled.div`
    margin: 0 auto;
    margin-top: 30px;
    padding: 5px;
    text-align: center;
    background-color: #d4edda;
    border: solid 1px #c3e6cb;
    color: #155724;
    width: 50%;
    border-radius: 10px;
`;

function CombinePlaylists() {

    const auth = useSelector(getAuth);
    const loggedIn = auth.loggedIn;
    const [playlists, setPlaylists] = useState({ selectedPlaylist1: '', selectedPlaylist2: '', combinedPlaylistLink: '', playlistList: [] });
    const [success, setSuccess] = useState(false);

    /**
     * Fetches playlists for the signed in user
     */
    async function fetchMyPlaylists() {
        try {
            const url = `https://api.spotify.com/v1/me/playlists?limit=50`;
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
    async function getTracksPromises(playlistId, offsets) {
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
     * Add missing songs into a playlist, with over 100 missing songs. Multiple API calls need to be made.
     * @param {*} playlistId id of playlist we want to add songs into
     * @param {*} allTracks contains all of the missing songs split into chunks of 100
     */
    async function addTracksPromises(playlistId, allTracks) {
        
        const promises = allTracks.map(async trackSubArr => {
            const result = await addTracksToPlaylist(playlistId, trackSubArr);
            return result;
        });

        const allPromises = await Promise.all(promises);
        
        var success = true;
        allPromises.forEach((promise) => {
            if(promise.status !== 201) {
                success = false;
            }
        });

        if(success) {
            onCombineSuccess();
        }
        else {
            alert("Uh oh, something went wrong. Please try again.");
        }
    }

    /**
     * Fetch all songs from a playlist. 
     * If a playlist has more than 100 songs, calls getTracksPromises where multiple calls to fetchPlaylistSongs need to be made since the Spotify API will only return 100 songs at a time.
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

                return getTracksPromises(playlistId, offsets);
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
        return results;
    }

    /**
     * After a playlist is successfully combined, show the success message and open the playlist in a popup window
     */
    function onCombineSuccess() {
        setSuccess(false);
        
        // get external link for playlist 1
        playlists.playlistList.forEach(playlist => {
            if (playlist.id === playlists.selectedPlaylist1) {
                setPlaylists({
                    ...playlists,
                    combinedPlaylistLink: playlist.external_urls.spotify,
                    selectedPlaylist1: '',
                    selectedPlaylist2: ''
                });

                // show success popup
                setSuccess(true);

                // open playlist link in new tab
                const newWindow = window.open(playlist.external_urls.spotify, '_blank');
                if (newWindow) newWindow.opener = null;
            }
        })
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
            if(song !== null) {
                p1TrackMap.set(song.track.uri, 1);
            } 
        })

        p2Tracks.forEach(song => {
            if(song !== null) {
                if (!p1TrackMap.has(song.track.uri)) {
                    missingSongs.push(song.track.uri);
                }
            }
        });

        // make sure that there are actually missing songs to add
        if (missingSongs.length <= 0) {
            alert('All songs from playlist 1 are already in playlist 2!');
            return;
        }

        // handle API calls if missingSongs > 100
        if(missingSongs.length > 100) {
            const numCalls = Math.floor(missingSongs.length / 100);
            var allMissingSongs = [];
            for (var i = 0; i <= numCalls; i++) {
                var start = i * 100;
                var end = start + 100;
                if (missingSongs.length < end) {
                    end = missingSongs.length;
                }
                const newArr = missingSongs.slice(start, end);
                allMissingSongs.push(newArr);
            }
            addTracksPromises(playlists.selectedPlaylist1, allMissingSongs);
            return;
        }

        // else missing songs <= 100 we don't need to make extra API calls
        else {
            const results = await addTracksToPlaylist(playlists.selectedPlaylist1, missingSongs);
            if (results.status) {
                onCombineSuccess();
            }
            else {
                alert("Uh oh, something went wrong. Please try again.");
            }
        }
    }

    useEffect(() => {
        if (loggedIn) {
            fetchMyPlaylists();
        }
    }, [loggedIn]);

    const changePlaylist1 = (e) => {
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
    }
    `;

    return (
        <>
        <Navigation/>
        <Jumbotron>
                <br></br>
                <h1 style={{ textAlign: "center"}}> Combine your playlists</h1>
                <p style={{textAlign: "center"}}> Add all unique songs from playlist 1 into playlist 2 </p>
        </Jumbotron>
        <Container fluid css={styles}>

                    {loggedIn ? (
                        <>
                        <Row>
                            <Col>
                            <h2> Playlist 1 </h2>
                            <Dropdown 
                                options={playlists.playlistList}
                                value={playlists.selectedPlaylist2}
                                change={changePlaylist2}
                            />
                            </Col>
                            <Col>
                                <h2> Playlist 2 </h2>
                            <Dropdown
                                options={playlists.playlistList}
                                value={playlists.selectedPlaylist1}
                                change={changePlaylist1}
                            />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                            <br></br>
                            <br></br>
                                <Button variant="success" onClick={combinePlaylists}>
                                    <h4> Combine! </h4>
                                </Button>
                            </Col>
                        </Row>
                        {success &&
                            <CombineSuccess>
                                <strong>Success!</strong> View your newly updated playlist <a href={playlists.combinedPlaylistLink}>here</a>
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close"
                                    onClick={() => {
                                        setSuccess(false);
                                    }}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </CombineSuccess>
                        }
                        </> 
                    ) : (
                        <Row>
                            <Col>
                            <Login/>
                            </Col>
                        </Row>
                        )}

        </Container>
    </>
    );
  }

  export default CombinePlaylists;