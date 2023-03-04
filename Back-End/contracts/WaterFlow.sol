// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
//import "hardhat/console.sol";

contract WaterFlow {
    mapping (address => string[]) public userDevices;
    mapping (string => string[]) public deviceCIDs;

    function addWaterFlowData(string memory deviceID, string memory CID) public {
        deviceCIDs[deviceID].push(CID);
        userDevices[msg.sender].push(deviceID);
    }
    function addDevice(string memory deviceId) public {
        // address user = msg.sender;
        // userDevices[user].push(deviceId);
        address user = msg.sender;
        bool deviceExists = false;
        for (uint i = 0; i < userDevices[user].length; i++) {
            if (keccak256(bytes(userDevices[user][i])) == keccak256(bytes(deviceId))) {
                deviceExists = true;
                break;
            }
        }
        if (!deviceExists) {
            userDevices[user].push(deviceId);
        } else {
            revert("Device already exists for this user.");
        }
    }
    function getWaterFlowData(string memory deviceID, uint index) public view returns (string memory) {
        return deviceCIDs[deviceID][index];
    }
    function getCIDsByDeviceID(string memory deviceID) public view returns (string[] memory) {
        return deviceCIDs[deviceID];
    }
    function getDeviceIDsByUser(address user) public view returns (string[] memory) {
        return userDevices[user];
    }

    function checkDeviceExists(string memory deviceID) public view returns (bool) {
        string[] memory deviceIDs = userDevices[msg.sender];
        for (uint i = 0; i < deviceIDs.length; i++) {
            if (keccak256(abi.encodePacked(deviceIDs[i])) == keccak256(abi.encodePacked(deviceID))) {
                return true;
            }
        }
        return false;
    }
}