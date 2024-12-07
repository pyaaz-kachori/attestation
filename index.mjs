// import {
//     EAS,
//     Offchain,
//     SchemaEncoder,
//     SchemaRegistry,
//     NO_EXPIRATION
    
//   } from "@ethereum-attestation-service/eas-sdk";
//   import { ethers } from "ethers";
  
  // export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
  
  // Initialize the sdk with the address of the EAS Schema contract address
  // const eas = new EAS(EASContractAddress);
  
  // Gets a default provider (in production use something else like infura/alchemy)
  // const provider = ethers.getDefaultProvider("sepolia");
  
  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  // eas.connect(provider);

// // //   const uid =
// // //   "0xff08bbf3d3e6e0992fc70ab9b9370416be59e87897c3d42b20549901d2cccc3e";

// // // const attestation = await eas.getAttestation(uid);

// // // console.log(attestation);


// // const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
// // const encodedData = schemaEncoder.encodeData([
// //   { name: "eventId", value: 1, type: "uint256" },
// //   { name: "voteIndex", value: 1, type: "uint8" },
// // ]);
// // const encodedData2 = schemaEncoder.encodeData([
// //   { name: "eventId", value: 10, type: "uint256" },
// //   { name: "voteIndex", value: 2, type: "uint8" },
// // ]);

// // const schemaUID =
// //   "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995";

// // // Signer is an ethers.js Signer instance
// // const signer = new ethers.Wallet(privateKey, provider);
// // const transaction = await eas.multiAttest([
// //   {
// //     schema: schemaUID,
// //     data: [
// //       {
// //         recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
// //         expirationTime: NO_EXPIRATION,
// //         revocable: true, // Be aware that if your schema is not revocable, this MUST be false
// //         data: encodedData,
// //       },
// //       {
// //         recipient: "0x2Abc446d758A1ED44c65299B07A4D2d6cA9db479",
// //         expirationTime: NO_EXPIRATION,
// //         revocable: false,
// //         data: encodedData2,
// //       },
// //     ]
// //   },
// // ],signer);

// // const newAttestationUID = await transaction.wait();

// // console.log("New attestation UID:", newAttestationUID);

// // console.log("Transaction receipt:", transaction.receipt);


// const offchain = await eas.getOffchain();
// const polygonRPC = "http://eth.merkle.io"
// const pro = new ethers.JsonRpcProvider(polygonRPC)
// const wallet = ethers.Wallet.createRandom(pro)

// const privKey = wallet.privateKey
// console.log(wallet)
// console.log(privKey)

// Initialize SchemaEncoder with the schema string
// Note these values are sample values and should be filled with actual values
// Code samples can be found when viewing each schema on easscan.org
// const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
// const encodedData = schemaEncoder.encodeData([
//   { name: "eventId", value: 1, type: "uint256" },
//   { name: "voteIndex", value: 1, type: "uint8" },
// ]);

// // Signer is an ethers.js Signer instance
// const signer = new ethers.Wallet("a290bca74f3a742b5f87ddeeefe4c42eda9c0158acda2a3618b37382de1cd95d", provider);

// const offchainAttestation = await offchain.signOffchainAttestation(
//   {
//     recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
//     expirationTime: NO_EXPIRATION, // Unix timestamp of when attestation expires (0 for no expiration)
//     time: BigInt(Math.floor(Date.now() / 1000)), // Unix timestamp of current time
//     revocable: true, // Be aware that if your schema is not revocable, this MUST be false
//     schema:
//       "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
//     refUID:
//       "0x0000000000000000000000000000000000000000000000000000000000000000",
//     data: encodedData,
//   },
//   signer
// );

// console.log("Offchain attestation:", offchainAttestation);




// // const schemaRegistryContractAddress = "0xYourSchemaRegistryContractAddress";
// const schemaRegistry = new SchemaRegistry(provider);

// schemaRegistry.connect(provider);

// const schema = "uint256 eventId, uint8 voteIndex";
// const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
// const revocable = true;

// const transaction = await schemaRegistry.register({
//   schema,
//   resolverAddress,
//   revocable,
// });

// // Optional: Wait for transaction to be validated
// await transaction.wait();

 /// onchain attestation
// import  { EAS, SchemaEncoder }  from "@ethereum-attestation-service/eas-sdk";
// import { ethers } from "ethers";
// const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
// const schemaUID = "0xe1c62a97e0a866e1c8790d7bd54872e1c2432c846dc30677679ab5190d588e4b";
// const eas = new EAS(easContractAddress);
// const provider = ethers.getDefaultProvider("sepolia");
// const signer = new ethers.Wallet("a290bca74f3a742b5f87ddeeefe4c42eda9c0158acda2a3618b37382de1cd95d", provider);
// // Signer must be an ethers-like signer.
// await eas.connect(signer);
// // Initialize SchemaEncoder with the schema string
// const schemaEncoder = new SchemaEncoder("bytes32 commitID,string username");
// const encodedData = schemaEncoder.encodeData([
// 	{ name: "commitID", value: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", type: "bytes32" },
// 	{ name: "username", value: "cheetahhikehde", type: "string" }
// ]);
// const tx = await eas.attest({
// 	schema: schemaUID,
// 	data: {
// 		recipient: "0x0000000000000000000000000000000000000000",
// 		expirationTime: 0,
// 		revocable: true, // Be aware that if your schema is not revocable, this MUST be false
// 		data: encodedData,
// 	},
// });
// const newAttestationUID = await tx.wait();
// console.log("New attestation UID:", newAttestationUID);


import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';

const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
const provider = ethers.getDefaultProvider("sepolia");
// const provider = "https://eth.merkle.io"
const signer = new ethers.Wallet("a290bca74f3a742b5f87ddeeefe4c42eda9c0158acda2a3618b37382de1cd95d", provider);

schemaRegistry.connect(signer);

const schema = "bytes32 commitID,string username, bool verified";
const resolverAddress = "0x0000000000000000000000000000000000000000"; // Sepolia 0.26
const revocable = true;

const transaction = await schemaRegistry.register({
  schema,
  resolverAddress,
  revocable,
});

// Optional: Wait for transaction to be validated
const uuid = await transaction.wait();

console.log(uuid)


// SUI CLIENT - Generated new keypair and alias for address with scheme "ed25519" [sleepy-idocrase: 0x04b7546ecfb94894674b56ddba8af5ad24609088162c824ea79d1c458b41bb4d]
// Secret Recovery Phrase : [rough can spell decide live hurdle cushion cupboard uphold fabric green fall]



const convertToNewFormat = (inputAttestation) => {
  return {
    sig: {
      domain: {
        name: inputAttestation.domain.name,
        version: inputAttestation.domain.version,
        chainId: parseInt(inputAttestation.domain.chainId, 10), // Convert string to integer
        verifyingContract: inputAttestation.domain.verifyingContract,
      },
      primaryType: inputAttestation.primaryType,
      types: {
        Attest: inputAttestation.types.Attest,
      },
      signature: {
        r: inputAttestation.signature.r,
        s: inputAttestation.signature.s,
        v: inputAttestation.signature.v,
      },
      uid: inputAttestation.uid,
      message: {
        version: 2, // Assigning version manually
        schema: schemaUID, // Assign schema manually
        recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165", // Assign recipient manually
        time: parseInt(inputAttestation.message.time, 10), // Convert time to integer
        expirationTime: inputAttestation.message.expirationTime,
        refUID: inputAttestation.message.refUID,
        revocable: inputAttestation.message.revocable,
        data: inputAttestation.message.data,
        nonce: 0, // Add nonce field manually
      },
    },
    signer: "0xeee68aECeB4A9e9f328a46c39F50d83fA0239cDF", // Add signer manually
  };
};
