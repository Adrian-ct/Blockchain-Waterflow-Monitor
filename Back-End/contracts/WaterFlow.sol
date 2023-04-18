// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract WaterFlow {
    mapping (address => string[]) public userDevices;
    mapping (string => string[]) public deviceCIDs;
    mapping (string => address) public deviceToOwner; 

    event WaterFlowDataAdded(string indexed deviceId, string CID);

    function addWaterFlowData(string memory deviceID, string memory CID) public {
        deviceCIDs[deviceID].push(CID);
        emit WaterFlowDataAdded(deviceID, CID);
    }
    
    function addDevice(string memory deviceId) public {
        address user = msg.sender;
        if (deviceToOwner[deviceId] == address(0)) {
            userDevices[user].push(deviceId);
            deviceToOwner[deviceId] = user;
        } else {
            revert("Device already exists for this user.");
        }
    }
    
    function getCIDsByDeviceID(string memory deviceID) public view returns (string[] memory) {
        return deviceCIDs[deviceID];
    }
    
    function getDeviceIDsByUser(address user) public view returns (string[] memory) {
        return userDevices[user];
    }

    function checkDeviceExists(string memory deviceID) public view returns (bool) {
        return deviceToOwner[deviceID] == msg.sender;
    }
    
    function getAddressByDeviceID(string memory deviceID) public view returns (address, bool) {
        address deviceOwner = deviceToOwner[deviceID];
        bool isValid = deviceOwner != address(0);
        return (deviceOwner, isValid);
    }

}
