//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract decenTodo {
    uint public taskCount = 0;
    mapping(uint => Task) public tasks;

    struct Task {
        uint id;
        string content;
        bool completed;
        uint256 date;
        bool dateIncluded;
    }

    event TaskCreated(
        uint id,
        string content,
        bool completed,
        uint256 date,
        bool dateIncluded
    );

    function createTask(string memory _content, uint256 _date, bool _dateIncluded) public {
        tasks[taskCount] = Task(taskCount, _content, false, _date, _dateIncluded);
        emit TaskCreated(taskCount, _content, false, _date, _dateIncluded);
        taskCount++;
    }
}