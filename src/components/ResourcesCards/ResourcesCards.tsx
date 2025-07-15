import React from 'react';
import './ResourcesCards.css';

type ResourcesCardProps = {
  title: string;
  description: string;
  link: string;
};

export default function ResourcesCards({ title, description, link }: ResourcesCardProps) {
  return (
    <div className="shade-card">
      <div className="shade-header">
        <div className="shade-icon">

        </div>
        <a href={link}><h2>{title}</h2></a>
      </div>
      <p>{description}</p>
    </div>
  );
}
