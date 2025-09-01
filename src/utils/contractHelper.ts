import { ethers } from 'ethers';
import contractABI from './Groth16Verifier.json';

const contractAddress = "0xEEAa66d09bE70e9d1F44f31440C9ac1CF1E80B23"; 
const abi = contractABI.abi;

// A function that returns the contract instance
export async function getVerifierContract() {
    console.log("abi", abi);
    console.log("contractAddress", contractAddress);
    if (!(window as any).ethereum) {
        throw new Error("MetaMask not found");
    }
    // request wallet connection
    await (window as any).ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    console.log("provider", provider);
    const signer = await provider.getSigner();
    console.log("signer", signer);  

    return new ethers.Contract(contractAddress, abi, signer);
}
