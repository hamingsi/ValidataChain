const { getNamedAccounts, ethers, network } = require("hardhat")
const fs = require("fs")
const { frontEndAbiLocation } = require("../helper-hardhat-config")
const {
    decodeResult,
    ReturnType
  } = require("@chainlink/functions-toolkit");

const consumerAddress = "0x708cbdccd88266e9954d0dec1a65ef6a92cb4d8c"
const consumerAbi = require("../abi/FunctionsConsumerExample.json")

async function main() {
    const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL // fetch mumbai RPC URL
    const privateKey = process.env.PRIVATE_KEY
    if (!rpcUrl)
      throw new Error(`rpcUrl not provided  - check your environment variables`);
  
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

    const wallet = new ethers.Wallet(privateKey)
    const signer = wallet.connect(provider) // create ethers signer for signing transactions
    
    const consumer = new ethers.Contract(consumerAddress, consumerAbi, signer)

    const s_lastResponse = await consumer.s_lastResponse()
    console.log("byted data: ", s_lastResponse )
    // for type hex to string
    decodedOutput = Buffer.from(s_lastResponse.slice(2), 'hex').toString();
    console.log(decodedOutput)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })