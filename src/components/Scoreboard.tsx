import React, { useState } from 'react';

interface Scoreboard {
    bestScore: number,
    currentScore: number
}

export default function Scoreboard(props: Scoreboard) {
    return (
        <div className='scoreboard'>
            <div className='current-score'>Current Score: {props.currentScore}</div>
            <div className='best-score'>Best Score: {props.bestScore}</div>
      </div>
    )
    
}