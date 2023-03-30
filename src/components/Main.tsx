import React, { useCallback, useEffect, useState } from 'react';
import Card from './Card';
import Scoreboard from './Scoreboard';

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



//

//style it(maybe with CSS framework) and also clean up code 

//keep track of pictures that are being clicked
//reorder the array, (could use useContext or useReducer)
//

//useCallback: call that function if the dependency changes
// useMemo: generates data structure if dependency changes

//-- async function that gets an array of all the objects from API and gets 

async function fetchCharacters() {
  const url = `https://thronesapi.com/api/v2/Characters`
  const res = await fetch(url, {mode: 'cors'})
  const characters: CharacterModel[] = await res.json()
  console.log(characters)
  //why parenthesis?
  return characters.map(char => ({
    name: char.fullName,
    id: char.id,
    image: char.imageUrl,
    clicked: false
  }))
}

export default function Main() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [characterAmount, setCharacterAmount] = React.useState<number>(6);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [lastGameScore, setLastGameScore] = useState(0)
  const [bestScore, setBestScore] = useState(0);
  const [newGame, setNewGame] = useState(false)

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
    //let newGame = false;
    //trackScore(characters, id);
    setNewGame(false)
    shuffleArr(characters);
    //if you modify it, it doesnt rerender component or change state
    
    const clickedCharacter = characters.find((char) => char.id === id);
    
    //why would undefined be returned? 
    if (clickedCharacter) {
      console.log(`${clickedCharacter.name} clicked`);

      if (!clickedCharacter.clicked) {
        setCurrentScore((prev) => prev + 1);
        console.log(currentScore)
        setCharacters(
          characters.map<Character>((char) => {
            if (char.id === id) {
              if (char.clicked) {
              } else {
                char.clicked = true;
              }
            }
            return char;
          })
        );
      }
      else {
        setNewGame(true)
        setLastGameScore(currentScore)
        resetGame();
      }
    }
    
  }

  const resetGame = useCallback(() => {
  
    setCharacters(
      shuffleArr(allCharacters).slice(0, characterAmount).map((char): Character => ({ ...char }))
    )

    setCurrentScore(0);
  }, [allCharacters, characterAmount])

  
  function handleCharAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewGame(false)
    const value = parseInt(event.target.value, 10);
    setCharacterAmount(value);
  }

  useEffect(() => {
    fetchCharacters().then(setAllCharacters).catch(console.error)
    shuffleArr(allCharacters)
    console.log('useEffect: get all characters from API')
}, [])
  
  useEffect(() => {
    console.log('useEffect: resetgame')
  resetGame()
},[allCharacters, resetGame])
  

  useEffect(() => {
    //updates best score if needed and resets game
    setBestScore(Math.max(currentScore, bestScore))
    
    if (currentScore === characterAmount) {
      resetGame()
      setLastGameScore(currentScore)
      setNewGame(true)
    }
  }, [currentScore, characterAmount, resetGame, bestScore])

  console.log('main component rendered')
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
          max ='54'
          name='characterAmount'
          value={characterAmount}
          onChange={handleCharAmountChange}
        />
      </label>
      
      <h2>Number of Characters: {characterAmount}</h2>
      <Scoreboard bestScore={bestScore} currentScore={currentScore} />
      {newGame && <p>New Game: You membered {lastGameScore} out of {characterAmount}</p>}
      
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
