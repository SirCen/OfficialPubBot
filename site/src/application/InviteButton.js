import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import '../resources/App.css';


export default class InviteButton extends Component {
    render() {
        return (
            <div>
            <a href="https://discordapp.com/api/oauth2/authorize?client_id=608365015610949661&permissions=8&scope=bot">
                <Button className="inviteBtn">Click here to Invite!</Button>
            </a>
            </div>
        );
    }
}