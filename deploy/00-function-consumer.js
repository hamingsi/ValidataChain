// function deployFunc() {
//     console.log("hi")
// }

const { network,ethers } = require("hardhat")
const { networkConfig, developmentChains,routerAddressMumbai,frontEndAbiLocation} = require("../helper-hardhat-config")
const fs = require("fs"); 
// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if chainId is X use addr Y
    log("Deployer Address:", deployer)
    const args = [routerAddressMumbai]
    const FunctionsConsumer = await deploy("FunctionsConsumerExample", {
        from: deployer,
        args: args, //routerAddress
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("FunctionConsumerExample Address:",FunctionsConsumer.address)
    log("------------------------------------")
}
module.exports.tags = ["all", "FunctionConsumerExample"]