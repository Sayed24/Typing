import { useState, useEffect } from 'react';

export const useKeyDown = (callback) => {
  const [keyDown, setKeyDown] = useState();

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (keyDown !== key && key.length === 1) {
        setKeyDown(key);
        callback && callback(key);
      }
    };
    const upHandler = () => {
      setKeyDown(null);
    };

    //Register both handlers with the browser
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    //return a function that cleans up
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });

  return keyDown;
};
