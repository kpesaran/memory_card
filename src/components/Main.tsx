import React, { useState, useEffect } from 'react';
import Card from '../components/Main';

export default function Main() {
  const character_amount = 6;
  const [characters, setCharacters] = useState<Character[]>([]);
  const [clickedCharacters, setClickedCharacters] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  interface CharacterModel {
    id: number;
    fullName: string;
    imageUrl: string;
  }
  interface Character {
    id: number;
    name: string;
    image: string;
  }
  console.log('component rendered');
  async function getImages(amount: number) {
    const charTempList: Character[] = [];
    for (let i = 0; i <= amount; i++) {
      const response = await fetch(
        `https://thronesapi.com/api/v2/Characters/${i}`,
        { mode: 'cors' }
      );
      const character: CharacterModel = await response.json();
      console.log(character);
      const id = character.id;
      const name = character.fullName;
      const image = character.imageUrl;
      charTempList.push({ id, name, image });
    }
    setCharacters(charTempList);
  }
  React.useEffect(() => {
    //inside useEffect don't use await.... use .then....
    getImages(10).catch((e) => console.log(e));
  }, []);

  return (
    <div>
      {characters.map((char) => (
        <Card picture={char.name} name={char.name} key={char.id} />
      ))}
    </div>
  );
}
