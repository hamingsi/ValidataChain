const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}
const artifactsAbiLocatio = "./artifacts/contracts/FunctionsConsumerExample.sol/FunctionsConsumerExample.json"
const frontEndAbiLocation = "./abi/FunctionsConsumerExample.json"
const routerAddressMumbai = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C"
const developmentChains = ["hardhat", "localhost"]
module.exports = {
    networkConfig,
    developmentChains,
    routerAddressMumbai,
    artifactsAbiLocatio,
    frontEndAbiLocation
}