import React, { Component} from 'react';
import { Link, animateScroll as scroll } from "react-scroll";
import '../resources/App.css';

export default class Scroll extends Component {
    constructor(props) {
        super();
        this.props = props;
    }
    scrollToBottom = () => {
        scroll.scrollToBottom();
      };
    render() {
        return (
            <div>
                <Link
                    activeClass="active"
                    to={this.props.id}
                    spy={true}
                    smooth={true}
                    offset={55}
                    duration={500}
                > <div className="border-arrow curvy curvy-inside flat-back"></div>
                </Link>
            </div>
        );
    }
}