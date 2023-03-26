import React, { useState } from 'react';
import Card from './Card';
import Scoreboard  from './Scoreboard';

//keep track of pictures that are being clicked
//reorder the array, (could use useContext or useReducer)
//

//useCallback: call that function if the dependency changes
// useMemo: generates data structure if dependency changes

export default function Main() {
  const [characterAmount, setCharacterAmount] = React.useState<number>(6);
  const [characters, setCharacters] = useState<Character[]>([]);
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
    clicked: boolean;
  }

  //function passed as prop to child components, that toggles the clicked for each character...  to the state clickedCharacters... also randomly rearrange the array... also check if character has been clicked previously

  // function trackScore(arr: Character[], id: number) {
  //   const clickedCharacter = arr.find((char) => char.id === id);
  //   if (clickedCharacter) {
  //     console.log(clickedCharacter);
  //     if (!clickedCharacter.clicked) {
  //       setCurrentScore((prev) => prev + 1);
  //       bestScoreTracker();
  //     }
  //   }
  // }



  function handleClick(id: number) {
    //let gameOver = false;
    //trackScore(characters, id);
    shuffleArr(characters);
    //if you modify it, it doesnt rerender component or change state
    
    const clickedCharacter = characters.find((char) => char.id === id);
    //why would undefined be returned? 
    if (clickedCharacter) {
      console.log(`${clickedCharacter.name} clicked`);

      if (!clickedCharacter.clicked) {
        //setCurrentScore inside setCharacters ?
        setCurrentScore((prev) => prev + 1);
        console.log(currentScore)
        bestScoreTracker(currentScore)
        setCharacters(
          characters.map<Character>((char) => {
            if (char.id === id) {
              if (char.clicked) {
                //gameOver = true;
              } else {
                char.clicked = true;
              }
            }
            return char;
          })
        );
      }
      else {
        resetGame();
      }
    }
    //----
    // setCharacters(
    //   characters.map<Character>((char) => {
    //     if (char.id === id) {
    //       if (char.clicked) {
    //         gameOver = true;
    //       } else {
    //           char.clicked = true ;
    //       }
    //     }
    //     return char;
    //   })
    // );
    //---
    //we call setCharacters inside gameOver, so don't want to call this function inside of setCharacters

    // if (gameOver) {
    //   resetGame();
    // }
    
  }

  function bestScoreTracker(score: number) {
    if (score > bestScore) {
      setBestScore(score);
    }
  }

  function resetGame() {
    setCharacters(
      characters.map<Character>((char) => {
        return { ...char, clicked: false };
      })
    );
    setCurrentScore(0);
  }

  function shuffleArr(arr: any[]) {
    // 2 ways of doing this:
    // slow way: nlogn but code is shorter
    // as you sort the array an array
    // array.sort((a, b) => 0.5 - Math.random());

    return arr.sort((a, b) => 0.5 - Math.random());
    // fast way: O(n) run time
    // create random number for 0 to n-1, what ever that number is you put it to index 0
    // swap that element you chose with last element, next iteration you look for random number 0 to n-2
  }

  function handleCharAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value, 10);
    setCharacterAmount(value);
  }

  console.log('component rendered');
  async function getImages(amount: number) {
    const charTempList: Character[] = [];
    for (let i = 0; i <= amount - 1; i++) {
      const response = await fetch(
        `https://thronesapi.com/api/v2/Characters/${i}`,
        { mode: 'cors' }
      );
      const character: CharacterModel = await response.json();
      console.log(character);
      const id = character.id;
      const name = character.fullName;
      const image = character.imageUrl;
      charTempList.push({ id, name, image, clicked: false });
    }
    setCharacters(charTempList);
  }

  React.useEffect(() => {
    //inside useEffect don't use await.... use .then....
    console.log('effect ran');
    //localStorage.setItem('bestScore',JSON.stringify(bestScore))
    getImages(characterAmount).catch((e) => console.log(e));
  }, [characterAmount]);

  return (
    <div>
      <h1>MEMORY GAME</h1>
      <label>
        {' '}
        Amount of Characters:
        <input
          type='number'
          placeholder='Set Amount of Characters'
          min='4'
          max='24'
          name='characterAmount'
          value={characterAmount}
          onChange={handleCharAmountChange}
        />
      </label>
      
      <h2>Number of Characters: {characterAmount}</h2>
      <Scoreboard bestScore = {bestScore} currentScore ={currentScore}/>
      <div className='card-grid'>
        {characters.map((char) => (
          <Card
            picture={char.image}
            name={char.name}
            key={char.id}
            id = {char.id}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}
