const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const optionsValidator = (options) => (input) => options.includes(input.trim());

const ask = async (question, defaultAnswer, validator) => {
    return new Promise((resolve) => {
        rl.question(`${question} ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}: `, (answer) => {
            const cleanAnswer = answer.trim();
            if (validator && !validator(cleanAnswer)) {
                console.log('Invalid input. Please try again.');
                return resolve(ask(question, defaultAnswer, validator));
            }
            resolve(cleanAnswer || defaultAnswer);
        });
    });
};

const emailValidator = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
const phoneValidator = (input) => /^\d{10}$/.test(input);
const nameValidator = (input) => input.length > 0;


let friends = [
    { fullName: "Tiya R", email: "tiya@example.com", phone: "1234567890", balance: 1000 },  // Lent
    { fullName: "Alice Smith", email: "alice@example.com", phone: "0987654321", balance: -250 }, // Owed
    { fullName: "Jiyan S", email: "jiyan@canvas.com", phone: "1122334455", balance: 0 }       // Settled
]; 


const addFriend = async () => {
    console.log('\n---  Add a New Friend ---');
    const firstName = await ask("First Name", null, nameValidator);
    const lastName = await ask("Last Name", null, nameValidator);
    const email = await ask("Email", null, emailValidator);
    const phone = await ask("Phone (10 digits)", null, phoneValidator);

    friends.push({ 
        firstName, 
        lastName, 
        fullName: `${firstName} ${lastName}`, 
        email, 
        phone,
        balance: 0 
    });
    console.log(`\n Added ${firstName} ${lastName} successfully!`);
};


const viewFriends = () => {
    if (friends.length === 0) {
        console.log("\nYour friend list is currently empty.");
        return;
    }

    console.log("\n--- Friend Balances (Owed/Lent) ---");
    
    const displayTable = {};
    friends.forEach((friend, index) => {
        let statusText = "";
        
        if (friend.balance > 0) {
            statusText = `Lent (They owe you $${friend.balance})`;
        } else if (friend.balance < 0) {
            statusText = `Owed (You owe them $${Math.abs(friend.balance)})`;
        } else {
            statusText = "Settled Up ($0)";
        }

        displayTable[index + 1] = {
            'Name': friend.fullName,
            'Email': friend.email,
            'Status': statusText
        };
    });

    console.table(displayTable);
};

const clearAllData = async () => {
    const confirm = await ask("\nAre you sure you want to clear ALL data? (yes/no)", "no");
    if (confirm.toLowerCase() === 'yes') {
        friends = [];
        console.log("Data cleaned");
    }
};


const run = async () => {
    const menu = `
1. Add Friend
2. View Balances (Owed/Lent)
3. Clear All Data
4. Exit
Choice`;

    const choice = await ask(menu, null, optionsValidator(['1', '2', '3', '4']));

    switch (choice) {
        case '1': await addFriend(); break;
        case '2': viewFriends(); break;
        case '3': await clearAllData(); break;
        case '4': 
            console.log("\nExit");
            rl.close(); 
            return; 
    }

    run(); 
};

run();