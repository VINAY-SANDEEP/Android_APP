import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        setResult(eval(input).toString());
      } catch {
        setResult('Invalid');
      }
    } else if (value === '←') {
      setInput(input.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
    }
  };

  const buttons = [
    ['C', '/', '*', '←'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', 'del', '%'],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.display}>
        <Text style={styles.inputText}>{input || '0'}</Text>
        <Text style={styles.resultText}>{result}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  btn === '=' && styles.equalsButton,
                  btn === 'C' && styles.clearButton,
                ]}
                onPress={() => handlePress(btn)}
                disabled={btn === ''}
              >
                <Text style={styles.buttonText}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'flex-end',
  },
  display: {
    paddingBottom: 30,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  inputText: {
    fontSize: 36,
    color: '#e0e0e0',
    textAlign: 'right',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 28,
    color: '#00ffa6',
    textAlign: 'right',
  },
  buttonsContainer: {
    paddingBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1f1f1f',
    flex: 1,
    marginHorizontal: 6,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
  },
  equalsButton: {
    backgroundColor: '#00b894',
  },
  clearButton: {
    backgroundColor: '#d63031',
  },
});
