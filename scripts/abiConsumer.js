const fs = require("fs"); 
const {artifactsAbiLocation, frontEndAbiLocation} = require("../helper-hardhat-config")

async function main() {
    const artConsumerEncoded = fs.readFileSync(artifactsAbiLocation,"utf-8")
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