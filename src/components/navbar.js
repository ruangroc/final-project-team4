import React from "react";
import { Nav, Navbar } from "react-bootstrap";

export default function Navigation() {
    return (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">Spotify Interactive</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Nav>   
                <Nav.Link href="/userstats">User Stats</Nav.Link>
                <Nav.Link href="/combineplaylists">Playlist Combiner</Nav.Link>
                <Nav.Link href="/developers">Developers</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    );
}