import React from "react";

export default function Commands({ title, subtitle}) {
  return (
    <div className="">
      <div className="section-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}