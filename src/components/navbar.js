import React from "react";
import { NavLink } from 'react-router-dom';
import { Nav, Navbar } from "react-bootstrap";
import styled from '@emotion/styled/macro';

const StyledNavlink = styled(NavLink)`
    text-decoration: none;
    padding: 10px;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
    color: grey;
    &:hover {
        color: black;
    }
`;

export default function Navigation() {
    return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand><StyledNavlink to="/">Spotify Interactive</StyledNavlink></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Nav>   
                <StyledNavlink to="/collabplaylist">Collab Playlist</StyledNavlink>
                <StyledNavlink to="/combineplaylists">Playlist Combiner</StyledNavlink>
                <StyledNavlink to="/developers">Developers</StyledNavlink>      
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    );
}