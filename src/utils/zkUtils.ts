
import { Buffer } from 'buffer';
import * as snarkjs from "snarkjs";
// @ts-ignore: untyped module
import builder from "./witness_calculator.js";
import { getVerifierContract } from './contractHelper';

export async function processInputs (a: string, b: string): Promise<{
    contractResponse: boolean,
    proof: any,
    publicSignals: any,
    argv: any,
    _a: any,
    _b: any,
    _c: any,
    _n: any
}> {

    
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (isNaN(numA) || isNaN(numB)) {
        return {
            contractResponse: false,
            proof: null,
            publicSignals: null,
            argv: null,
            _a: null,
            _b: null,
            _c: null,
            _n: null
        };
    }
    
    const inputs = { a: numA, b: numB };

    // Generate Witness
    const wasmResponse = await fetch('/circuit/multiplier.wasm'); // Relative to public/
    const wasmBuffer = await wasmResponse.arrayBuffer();
    const wasm = Buffer.from(wasmBuffer);
    const wc = await builder(wasm, { sanityCheck: true }); // witness calculator
    const witnessBin = await wc.calculateWTNSBin(inputs, true); // binary format
    console.log("Witness Calculator", wc);

    // Generate Proof
    const zkey = await fetch('./circuit/multiplier.zkey');
    const zkeyBuffer = await zkey.arrayBuffer();
    const zkeyFinal = new Uint8Array(zkeyBuffer);
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkeyFinal, witnessBin);
    console.log("proof", proof);
    console.log("publicSignals", publicSignals);

    // Format calldata for Solidity Verifier
    const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
    const argv = JSON.parse("[" + calldata + "]"); // format to proper json format
    console.log("argv", argv);

    const _a = argv[0]; // parts of proof
    const _b = argv[1];
    const _c = argv[2];
    const _n = argv[3]; // public signals of circuit

    // Verify Proof on-chain
    const verifierContract = await getVerifierContract();
    const contractResponse = await verifierContract.verifyProof(_a, _b, _c, _n);

    return { contractResponse, proof, publicSignals, argv, _a, _b, _c, _n };
};