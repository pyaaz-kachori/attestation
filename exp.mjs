import {
    EAS,
    Offchain,
    SchemaEncoder,
    SchemaRegistry,
    NO_EXPIRATION,

  } from "@ethereum-attestation-service/eas-sdk";
  import pkg from '@ethereum-attestation-service/eas-sdk';
  import fs  from 'fs';
  const { OFFCHAIN_ATTESTATION_VERSION, PartialTypedDataConfig } = pkg;

  import { ethers } from "ethers";
  import axios from "axios";

  const rpc = "https://eth.merkle.io";
  const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
  const schema = "bytes32 commitID,string username, bool verified";
  // Initialize the sdk with the address of the EAS Schema contract address
  const eas = new EAS(EASContractAddress);
  const publisher_url = "https://publisher.walrus-testnet.walrus.space"

const aggregator_url = "https://aggregator.walrus-testnet.walrus.space" 
  // Gets a default provider (in production use something else like infura/alchemy)
  const provider = ethers.getDefaultProvider("sepolia");
const schemaUID = "0x2cfdd9dee69931092aeae8ffcb8d7e268a885ec2e2b35b3ddb8f8be2b24f576d"

  // Connects an ethers style provider/signingProvider to perform read/write functions.
  // MUST be a signer to do write operations!
  eas.connect(provider);
  const signer = new ethers.Wallet("a290bca74f3a742b5f87ddeeefe4c42eda9c0158acda2a3618b37382de1cd95d", rpc);
  const offchain = await eas.getOffchain();

  async function createOffchainAttestationJSON(encodedData) {
    const NO_EXPIRATION = 0;

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        recipient: "0x0000000000000000000000000000000000000000",
        expirationTime: NO_EXPIRATION, // Unix timestamp of when attestation expires (0 for no expiration)
        time: BigInt(Math.floor(Date.now() / 1000)), // Unix timestamp of current time
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        schema:
          schemaUID,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      signer
    );

    // delete offchainAttestation["types"];

    return offchainAttestation
  }
  const schemaEncoder = new SchemaEncoder(schema);
  const encodedData = schemaEncoder.encodeData([
    { name: "commitID", value: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", type: "bytes32" },
    { name: "username", value: "cheetahhikehde", type: "string" },
    { name: "verified", value: "true", type: "bool" }
  ]);

async function uploadBLOB(data){
    const store_url = `${publisher_url}/v1/store`
    const response = await axios.put(
        store_url,
        data
    )
    return response.data 
}

async function downloadBLOB(blob_id){
    const store_url = `${aggregator_url}/v1/${blob_id}`
    const response = await axios.get(
        store_url
    )
    return response.data
}

async function verifyAttestation(attestation,signer){
    const EAS_CONFIG = {
        address: attestation.sig.domain.verifyingContract,
        version: attestation.sig.domain.version,
        chainId: attestation.sig.domain.chainId,
      };
      const offchain = new Offchain(EAS_CONFIG, OFFCHAIN_ATTESTATION_VERSION);
      const isValidAttestation = offchain.verifyOffchainAttestationSignature(
        attestation.signer,
        attestation.sig
      );
      return isValidAttestation
}

function convertAttestationObject(inputAttestation, signer) {
    const schemaUID = inputAttestation.message.schema; // Use the schema from the input
    const obj = {
        sig: {
            version: 2, // Fixed version
            domain: {
                name: inputAttestation.domain.name,
                version: inputAttestation.domain.version,
                chainId: inputAttestation.domain.chainId.toString(), // Convert bigint to string
                verifyingContract: inputAttestation.domain.verifyingContract,
            },
            primaryType: inputAttestation.primaryType,
            types: {
                Attest: [
                    { name: "version", type: "uint16" },
                    { name: "schema", type: "bytes32" },
                    { name: "recipient", type: "address" },
                    { name: "time", type: "uint64" },
                    { name: "expirationTime", type: "uint64" },
                    { name: "revocable", type: "bool" },
                    { name: "refUID", type: "bytes32" },
                    { name: "data", type: "bytes" },
                    { name: "salt", type: "bytes32" },
                ],
            },
            signature: {
                r: inputAttestation.signature.r,
                s: inputAttestation.signature.s,
                v: inputAttestation.signature.v,
            },
            uid: inputAttestation.uid,
            message: {
                version: 2, // Fixed version
                schema: schemaUID, // Use the schema from inputAttestation
                recipient: inputAttestation.message.recipient, // Use the recipient from inputAttestation
                time: inputAttestation.message.time.toString(), // Convert bigint to string
                expirationTime: inputAttestation.message.expirationTime.toString(), // Convert bigint to string
                refUID: inputAttestation.message.refUID,
                revocable: inputAttestation.message.revocable,
                data: inputAttestation.message.data,
                nonce: "0", // Add a fixed nonce
                salt: inputAttestation.message.salt,
            },
        },
        signer: "0x864512FDeef2185Bfb8e736Ce5f54dEe09fDa9b4", // Add signer manually or use the provided value
    };

    function replacer(key, value) {
        if (typeof value === "bigint") {
            return value.toString(); // Convert bigint to string
        }
        return value;
    }

    return JSON.stringify(obj, replacer, 2); // Return the JSON string with formatting
}

console.log(signer)
const JSONBLOB = await createOffchainAttestationJSON(encodedData)
console.log(`Attested object ------> ${JSONBLOB}`)
const conv = convertAttestationObject(JSONBLOB,signer)
const resp = await uploadBLOB(conv)
console.log("Blob generated")
console.log(`Blob id -----> ${resp.newlyCreated.blobObject.blobId}`)
const tx_hash = await uploadBLOB(conv)
console.log(`To checkout the transaction go to -> https://suiscan.xyz/testnet/tx/${tx_hash.alreadyCertified.eventOrObject.Event.txDigest}`)
console.log(`Checkout the blob at ${aggregator_url}/v1/${resp.newlyCreated.blobObject.blobId}`)
const blob = await downloadBLOB(resp.newlyCreated.blobObject.blobId)
console.log("Blob downloaded and saved.")
fs.writeFileSync("attestation.json",JSON.stringify(blob))

// const attestation =blob

// const EAS_CONFIG = {
//     address: attestation.sig.domain.verifyingContract,
//     version: attestation.sig.domain.version,
//     chainId: attestation.sig.domain.chainId,
// };
// const ofc = new Offchain(EAS_CONFIG, OFFCHAIN_ATTESTATION_VERSION);
// console.log(offchain);
// const isValidAttestation = offchain.verifyOffchainAttestationSignature(
//     attestation.signer,
//     attestation.sig
// );
// console.log(isValidAttestation)
// console.log(isValidAttestation)