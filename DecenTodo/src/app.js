app = {
    contracts: [],

    load: async () => {
        try {
            await app.loadWeb3();
            await app.loadAccount();
            await app.loadContract();
            app.addEventListeners();
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
            app.contracts.decenTodo = await decenTodoContract.deployed();
            if(app.contracts.decenTodo == undefined) throw "Couldn't get smart contract from blockchain"
            console.log("Smart contract loaded successfully");
        } catch (error) {
            console.log("Error occured while loading smart contract: " + error);
            throw error;
        }
    },

    addEventListeners: () => {
        $('#addTaskButton').on('click', async () => {
            $contentInput = $('#contentInput');
            $dateInput = $('#dateInput');
            $dateIncludedCb = $('#dateIncludedCb');

            content = $contentInput.val();
            console.log(content);
            date = new Date($dateInput.val());
            dateIncluded = $dateIncludedCb.prop('checked');

            await app.contracts.decenTodo.createTask(content, date.getTime(), dateIncluded, { from: app.account });
        })
    },
}

$(async () => {
    await app.load();
})