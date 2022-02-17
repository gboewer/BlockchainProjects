const { assert } = require("chai")

const decenTodo = artifacts.require('./decenTodo.sol')

contract('decenTodo', (accounts) => {
    const content = 'testContent'
    const date = 0;
    const dateIncluded = true;

    before(async () => {
        this.decenTodo = await decenTodo.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.decenTodo.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('creates tasks and events', async () => {
        const result = await this.decenTodo.createTask(content, date, dateIncluded)
        const taskCount = await this.decenTodo.taskCount()
        const event = result.logs[0].args
        assert(taskCount == 1)
        assert(event.content == content)
        assert(event.date == date)
        assert(event.dateIncluded == dateIncluded)
    })
}) 