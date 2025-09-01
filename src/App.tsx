import React, { useState, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { ethers } from 'ethers'; 
import styled from 'styled-components';
import { processInputs } from './utils/zkUtils';
import './App.css';

// Add global type for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const MathContainer = styled.div`
  max-width: 100%;
  width: 100%;
  text-align: center;
  margin: 20px auto;
  max-width: 600px;
`;

const App: React.FC = () => {

  // Metmask Integration
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [error, setMessage] = useState<string | null>(null);

  // State to store the two numbers and the result
  const [number1, setNumber1] = useState<number | ''>('');
  const [number2, setNumber2] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

// Initialize provider and check for MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch((err: any) => setMessage('Failed to fetch accounts: ' + err.message));
    } else {
      setMessage('MetaMask not detected. Please install MetaMask.');
    }
  }, []);

// Connect to MetaMask
  const connectToMetaMask = async () => {
    if (!window.ethereum) {
      setMessage('MetaMask not detected. Please install MetaMask.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setMessage(null);
      switchToSepolia();
    } catch (err: any) {
      setMessage('Failed to connect to MetaMask: ' + err.message);
    }
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID (11155111 in hex)
      });
      //show success message
    } catch (err: any) {
      if (err.code === 4902) {
        // Network not added to MetaMask, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '1axsdfsdfkkdjfsf4',
              chainName: 'Sepolia Testnet',
              rpcUrls: [`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`],
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      } else {
        setMessage('Failed to switch to Sepolia: ' + err.message);
      }
    }

  };


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
      const verifierResponse = processInputs(number1.toString(), number2.toString())
      const verifierResult = verifierResponse.then(result => {
          console.log(result); // prints "Hello!" after 1 second
      })
    } else {
      setResult(null);
      alert('Please enter valid numbers');
    }
  };

  return (
    <div className="App">
      <h1 className="title">
        my-zk-app
      </h1>      
      {!account ? (
        <button onClick={connectToMetaMask}>Connect MetaMask to Sepolia Network</button>
      ) : (
        <div className="account-info">
          <p>Account connected to Sepolia: {account}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <div className="classic-paragraph">
        <p>
        Groth16 zkSNARKs are a type of zero-knowledge proof that allows one party (the prover) to prove to another party (the verifier) that they know a value (or values) without revealing any information about the value itself. This is achieved through complex mathematical constructs that ensure the proof is both sound (i.e., a false statement cannot be proven true) and zero-knowledge (i.e., no information about the value is revealed).
        </p>
        </div>
      <div className="classic-paragraph">
        <p> 
        This application is a demonstration of a zkSNARK verifier built with Circom and Solidity.
        Here the goal is to prove to someone that we know two numbers <InlineMath math="a" /> and <InlineMath math="b" /> (i.e. factorization) such that,
        </p>
      </div>

      <MathContainer>
      <BlockMath math="a \cdot b = N " />
      </MathContainer>

      <div className="classic-paragraph">
        <p>
        Enter two numbers below and our zkSNARK-powered Solidity verifier, will prove that we know the factorization of <InlineMath math="N"/> without revealing the numbers to the verifier securely and privately.
        </p>      
      </div>
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
        {result !== null && (
        <p className="result"> <InlineMath math="N" /> = {result}</p>
        )}
        <button onClick={calculateProduct}>Prove using Solidity Verifier</button>
      </div>
      <a href="https://github.com/wgopar/my-zk-app" target="_blank" rel="noopener noreferrer">Application Github (my-zk-app) </a> - React Front End and integration with Solidity Deployed Verifier<br />
      <a href="https://github.com/wgopar/zk-prototype" target="_blank" rel="noopener noreferrer">Circuit Creation Github</a> - Circuit Generation, Solidity Verifier Creation and Deployment with Hardhat
    </div>
  );
};

export default App;