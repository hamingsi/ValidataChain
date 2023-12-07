const { network,ethers } = require("hardhat")
const { routerAddressMumbai,frontEndContractsFile} = require("../helper-hardhat-config")
const fs = require("fs"); 
const { Contract } = require("hardhat/internal/hardhat-network/stack-traces/model");
// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if chainId is X use addr Y
    log("Deployer Address:", deployer)
    const args = [routerAddressMumbai]
    const validata = await deploy("Validata", {
        from: deployer,
        args: args, //routerAddress
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Validata Address:",validata.address)
    
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf-8"))
    if (chainId in contractAddresses){
        if(!contractAddresses[chainId]["validata"].includes(validata.address)){
            contractAddresses[chainId]["validata"].push(validata.address)
        }
    }else{
        contractAddresses[chainId] = { "validata": [validata.address]}
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
    
    log("------------------------------------")
}
module.exports.tags = ["all", "Validata"]