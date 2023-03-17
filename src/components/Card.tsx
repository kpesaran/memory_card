import React from 'react';

interface CardProps {
  name: string;
  picture: string;
  key: number;
}

export default function Card(props: CardProps) {
  return (
    <div className='card'>
      <img src={props.picture} alt='?' />
      <p>{props.name}</p>
    </div>
  );
}
