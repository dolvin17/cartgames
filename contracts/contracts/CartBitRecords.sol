// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract CartBitRecords {
    // game_id is a hash of the game name
    bytes32[] public games;

    // value is in seconds
    mapping(address => mapping(bytes32 => uint)) private records;

    event NewRecord(address indexed player, bytes32 game_id, uint256 score);

    // NOTE: This function is only for testing purposes
    // Ideal should be emited by the game contract
    // Or by a backend service, or msg.sender as the player
    function addRecord(
        address _player,
        bytes32 _game_id,
        uint256 _seconds_played
    ) external {
        require(_player != address(0), "Invalid player address");
        require(_seconds_played > 0, "Invalid time played");
        require(_game_id != 0, "Invalid game id");

        // Emit an event to log the new record
        emit NewRecord(_player, _game_id, _seconds_played);

        bool found = false;
        for (uint8 i = 0; i < games.length; i++) {
            if (games[i] == _game_id) {
                found = true;
                break;
            }
        }

        if (!found) {
            // Add the game to the list of games
            games.push(_game_id);
        }

        records[_player][_game_id] += _seconds_played;
    }

    function getPlayedTime(address _player) external view returns (uint256) {
        uint256 total = 0;
        for (uint8 i = 0; i < games.length; i++) {
            total += records[_player][games[i]];
        }
        return total;
    }

    function getPlayedTime(
        address _player,
        bytes32 _game_id
    ) external view returns (uint256) {
        return records[_player][_game_id];
    }
}
