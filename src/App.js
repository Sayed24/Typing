import { useEffect, useState } from 'react';
import { createFakeWords } from './utils/words';
import { useKeyDown } from './hooks/useKeyDown';
import styled from 'styled-components';
import { getCurrentTime } from './utils/time';

import logo from './logo.svg';
import './App.css';

const initialWords = createFakeWords();

// Build our styled components
const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;
const Link = styled.a`
  color: #38c9f5;
`;
const Characters = styled.p`
  white-space: pre;
`;

const CharacterCurrent = styled.span`
  background-color: #38c9f5;
`;
const CharacterOut = styled.span`
  color: #525252;
`;

function App() {
  const [leftPadding, setLeftPadding] = useState(
    new Array(20).fill(' ').join('')
  );

  //Game logic state
  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initialWords.slice(1));
  //Scoreboard state
  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState('');

  //implement our custom hook
  useKeyDown((key) => {
    //as soon as we trigger a keypress, sets our start time
    if (!startTime) {
      setStartTime(getCurrentTime());
    }

    //recalc WPM when user is about to finish a word (whether or not the next character is ' ')
    if (key === currentChar) {
      if (incomingChars.charAt(0) === ' ') {
        setWordCount(wordCount + 1);
        const durationInMinutes = (getCurrentTime() - startTime) / 60000;
        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
      }
    }

    let updatedTypedChars = typedChars + key;
    setTypedChars(updatedTypedChars);

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    //check if the use hits the correct key
    if (key === currentChar) {
      //then reduce leftpadding by one character length
      if (leftPadding > 0) {
        setLeftPadding(leftPadding.slice(1));
      }
      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      //set current character to the VERY FIRST character of our current INCOMING chars
      setCurrentChar(incomingChars.charAt(0));

      //Remove first charcter from incomign characters, and check if
      //incomignChars still has enough words
      //// ***if not, replenish words (createFakeWords())

      updatedIncomingChars = incomingChars.slice(1);
      if (updatedIncomingChars.split(' ').length < 10) {
        updatedIncomingChars += ' ' + createFakeWords();
      }
      setIncomingChars(updatedIncomingChars);
      setAccuracy(
        (
          (updatedOutgoingChars.length * 100) /
          updatedTypedChars.length
        ).toFixed(2)
      );
    }
  });

  return (
    <div className='App'>
      <Header>
        <img src={logo} className='App-logo' alt='logo' />
        <Characters>
          <CharacterOut>
            {(leftPadding + outgoingChars).slice(-20)}
          </CharacterOut>
          <CharacterCurrent>{currentChar}</CharacterCurrent>
          <span>{incomingChars.substr(0, 20)}</span>
        </Characters>
        <h3>
          WPM: {wpm} | ACC: {accuracy}%
        </h3>
        <Link
          href='https://github.com/Sayed24'
          target='_blank'
        >
          Github
        </Link>
      </Header>
    </div>
  );
}

export default App;
