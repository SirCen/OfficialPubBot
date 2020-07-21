import React from "react";
import '../resources/App.css';
import InviteButton from './InviteButton';

export default function Invite({ title, dark}) {
  return (
    <div className={"section" + (dark ? " Section2" : "")}>
      <div className="section-content">
        <h1>{title}</h1>
        <InviteButton />
      </div>
    </div>
  );
}