import React, { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import styled from 'styled-components';
import './App.css';

const MathContainer = styled.div`
  max-width: 100%;
  width: 100%;
  text-align: center;
  margin: 20px auto;
  max-width: 600px;
`;

const App: React.FC = () => {
  // State to store the two numbers and the result
  const [number1, setNumber1] = useState<number | ''>('');
  const [number2, setNumber2] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  // Handle input changes
  const handleNumber1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumber1(value === '' ? '' : parseFloat(value));
  };

  const handleNumber2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumber2(value === '' ? '' : parseFloat(value));
  };

  // Handle button click
  const calculateProduct = () => {
    if (typeof number1 === 'number' && typeof number2 === 'number') {
      setResult(number1 * number2);
    } else {
      setResult(null);
      alert('Please enter valid numbers');
    }
  };

  return (
    <div className="App">
      <h1 style={{
        maxWidth: '100%',
        width: '100%',
        textAlign: 'center',
        fontFamily: '"Georgia", "Times New Roman", serif',
        fontSize: '2.2rem',
        color: '#2c3e50',
        fontWeight: '500',
        letterSpacing: '0.05em',
        margin: '20px auto',
      }}>
        my-zk-app
      </h1>      
      <p style={{ maxWidth: '100%', width: '50%', margin: '0 auto', paddingBottom: '20px' }}>
        This application is a demonstration of a zkSNARK verifier built with Circom and Solidity.
        Here the goal is to prove to someone that we know two numbers <InlineMath math="a" /> and <InlineMath math="b" /> (i.e. factorization) such that,
        <MathContainer>
        <BlockMath math="a \cdot b = N " />
        </MathContainer>


        Enter two numbers below and click "Verify," and our zkSNARK-powered Solidity verifier, built with Circom, will verify that we know the factorization of <InlineMath math="N"/> without revealing the numbers themselves securely and privately.
      </p>      
      <div className="input-container">
        <input
          type="number"
          value={number1}
          onChange={handleNumber1Change}
          placeholder="Enter first number"
        />
        <input
          type="number"
          value={number2}
          onChange={handleNumber2Change}
          placeholder="Enter second number"
        />
        <button onClick={calculateProduct}>Prove using Solidity Verifier</button>
      </div>
      {result !== null && (
        <p className="result"> <InlineMath math="N" /> = {result}</p>
      )}
      <a href="https://github.com/wgopar/my-zk-app" target="_blank" rel="noopener noreferrer">github</a>    
    </div>
  );
};

export default App;