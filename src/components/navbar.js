import React from "react";
import { NavLink, Link } from 'react-router-dom';
import {Nav, Navbar, NavDropdown, Form, FormControl, Button, Dropdown, NavItem } from "react-bootstrap";



export default function Navigation(){
    return(
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Spotify Interactive </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            </Nav>
            <Nav>   
            <Nav.Link href="/collabplaylist">Collab Playlist</Nav.Link>
            <Nav.Link href="/playlistcombiner">Playlist Combiner</Nav.Link>
            <Nav.Link href="/developers">Developers</Nav.Link>
         </Nav>
            
        </Navbar.Collapse>
    </Navbar>
    );
}