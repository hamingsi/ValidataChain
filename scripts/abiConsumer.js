const fs = require("fs"); 
const {artifactsAbiLocatio, frontEndAbiLocation} = require("../helper-hardhat-config")

async function main() {
    const artConsumerEncoded = fs.readFileSync(artifactsAbiLocatio,"utf-8")
    const artConsumer = JSON.parse(artConsumerEncoded)
    const abiConsumer = JSON.stringify(artConsumer["abi"])
    fs.writeFileSync(frontEndAbiLocation, abiConsumer)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })