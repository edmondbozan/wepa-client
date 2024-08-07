// components/TypingText.tsx
import normalize from '@/fonts/fonts';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

interface TypingTextProps {
  text: string;
  speed?: number; // Speed of typing effect (in milliseconds)
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <Text style={styles.typingText}>{displayedText}</Text>;
};

const styles = StyleSheet.create({
  typingText:{
    margin: 10,
    color: '#FFF',
    fontSize:normalize(16),
    // fontWeight:'',
    fontFamily: 'Pacifico-Regular',
    fontWeight:'600'

  }
});

export default TypingText;
