// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract Validata is FunctionsClient, ConfirmedOwner {
    // struct 
    struct Data {
        address Creater;
        address[] User;
        bytes32 dataHash;
        // verify data is bool
        uint256 dataPrice;
        uint256 dataId;
        string dataDescribe;
    }
    // event
    event CreaterCreated(
        address Creater,
        bytes32 dataHash,
        uint256 dataPrice,
        uint256 dataId,
        string dataDescribe
    );

    event UserCreated(
        address User,
        uint256 dataPrice,
        uint256 selectId
    );

    event DataHashGenerated(
        uint256 dataId,
        bytes32 dataHash
    );

    event Response(bytes32 indexed requestId, bytes response, bytes err, uint256 dataId);

    error UnexpectedRequestID(bytes32 requestId);

    using FunctionsRequest for FunctionsRequest.Request;

    Data[] dataList;
    uint256 data_id;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    mapping(uint256 => bytes) public DataIdToDataHash;

    // modifier

    modifier onlyCreater {
        bool isCreater;
        for(uint256 i = 0; i < dataList.length; i++){
            if (dataList[i].Creater == msg.sender){
                isCreater = true;
            }
        }
        require(isCreater, "You need to be Creater, please upload your data at least once ");
        _;
    }

    modifier onlyUser {
        bool isUser;
        for(uint256 i = 0; i < dataList.length; i++){
            for(uint256 j = 0; j < dataList[i].User.length; j++){
                if ( dataList[i].User[j] == msg.sender){
                    isUser = true;
                }
            }
            
        }
        require(isUser, "You need to be Creater, please upload your data at least once ");
        _;
    }
    
    constructor(
        address router
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    // function

    function CreateData(bytes32 dataHash, uint256 price, string memory descriptor) public{
        address[] memory user = new address[](0);
        Data memory newData = Data(msg.sender, user, dataHash, price, data_id, descriptor); 
        dataList.push(newData);
        // emit event here UserCreated
        emit CreaterCreated(msg.sender, dataHash, price, data_id, descriptor);
        data_id++;
    }

    function CreateUser(uint256 selectId) public payable{
        require(msg.value >= dataList[selectId].dataPrice, "You don't send enough eth to buy the data!");
        (bool success, ) = dataList[selectId].Creater.call{value: msg.value}("");
        require(success, "Transaction(buy data) Failed!");
        dataList[selectId].User.push(msg.sender);
        emit UserCreated(msg.sender, dataList[selectId].dataPrice, selectId);
    }

    function GetDataLength() public view returns (uint256){
        return dataList.length;
    }

    function GetDataUser(uint256 dataId) public view returns(address[] memory){
        return dataList[dataId].User;
    }

    function GetDataDescribe(uint256 dataId) public view returns(string memory){
        return dataList[dataId].dataDescribe;
    }

    function GetDataPrice(uint256 dataId) public view returns(uint256){
        return dataList[dataId].dataPrice;
    }

    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (args.length > 0) req.setArgs(args);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }
    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
        if(response.length != 0) 
            DataIdToDataHash[data_id] = response;
        emit Response(requestId, s_lastResponse, s_lastError, data_id);
    }
}