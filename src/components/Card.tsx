import React from 'react';

interface CardProps {
  name: string;
  picture: string;
  key: number;
  id: number;
  onClick: (id: number) => void;
}

export default function Card(props: CardProps) {
  return (
    <div className='card'>
      <img
        className='card-img'
        onClick={() => {
          props.onClick(props.id);
        }}
        src={props.picture}
        alt='?'
      />
      <p>{props.name}</p>
    </div>
  );
}
