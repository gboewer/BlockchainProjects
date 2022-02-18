

app = {

    taskFieldsEnum: {
        ID: 0,
        CONTENT: 1,
        COMPLETED: 2,
        DATE: 3,
        DATEINCLUDED: 4,
    },

    load: async () => {
        try {
            await app.loadWeb3();
            await app.loadAccount();
            await app.loadContract();
            app.addEventListeners();
            await app.updateWindow();
            console.log("Loading completed successfully!");
        } catch (error) {
            console.log("Loading failed");
        }
    },

    loadWeb3: async () => {
        try {
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                await ethereum.request({ method: 'eth_requestAccounts' });
                console.log("Web3 loaded successfully");
            } else throw "Metamask extension not installed";
        } catch (error) {
            console.log("Error occured while loading web3: " + error);
            throw error;
        }
    },

    loadAccount: async () => {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            app.account = accounts[0];
            console.log("Account loaded successfully");
        } catch (error) {
            console.log("Error occured while loading account: " + error);
            throw error;
        }
    },

    loadContract: async () => {
        try {
            const decenTodo = await $.getJSON('/build/contracts/decenTodo.json');
            const decenTodoContract = TruffleContract(decenTodo);
            decenTodoContract.setProvider(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
            app.decenTodo = await decenTodoContract.deployed();
            if (app.decenTodo == undefined) throw "Couldn't get smart contract from blockchain"
            console.log("Smart contract loaded successfully");
        } catch (error) {
            console.log("Error occured while loading smart contract: " + error);
            throw error;
        }
    },

    addEventListeners: () => {
        $('#addTaskButton').on('click', callbackFunctions.AddTaskButton);
    },

    //TODO: rename date to datetime
    updateWindow: async () => {
        let $tasksList = "";
        const taskCount = await app.decenTodo.taskCount();
        for (let i = 0; i < taskCount; i++) {


            const dateTimeConverted = new Date(date.toNumber());

            const $tasksListItem = `<li>${content}  -  ${dateIncluded ? "Date-time:" + dateTimeConverted + "  - " : ""} Completed: ${completed ? 'Yes' : 'No'}</li>`;
            $tasksList += $tasksListItem;
        }
        $('#tasksList').append($tasksList);
    }
}

const callbackFunctions = {
    AddTaskButton: async () => {
        try {
            $contentInput = $('#contentInput');
            $dateInput = $('#dateInput');
            $dateIncludedCb = $('#dateIncludedCb');

            const input = {
                CONTENT: 0,
                DATE: 1,
            }

            let missing = [];
            content = $contentInput.val();
            if (content == "" || content == undefined)
                missing.push(input.CONTENT);

            dateString = $dateInput.val();
            date = new Date(dateString);
            if (dateString == "")
                missing.push(input.DATE);

            dateIncluded = $dateIncludedCb.prop('checked');

            if (missing.length > 0) {
                let missingString = "Please provide all missing information: ";
                for (let i = 0; i < missing.length; i++) {
                    let substring = "";
                    switch (missing[i]) {
                        case input.CONTENT:
                            substring += 'content';
                            break;

                        case input.DATE:
                            substring += 'date';
                            break;
                    }

                    if (i < missing.length - 1)
                        substring += ', ';

                    missingString += substring;
                }

                throw missingString;
            }
            await app.decenTodo.createTask(content, date.getTime(), dateIncluded, { from: app.account });
        } catch (error) {
            console.log(error);
        }
        app.updateWindow();
    }
}

$(async () => {
    await app.load();
})