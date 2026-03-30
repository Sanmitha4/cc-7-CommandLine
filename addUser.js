const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

let currentUser = null;
let friends = [];
let expenses = []; 

const validateName = (val) => {
    if (val.trim().length < 3) return { valid: false, message: "Name must be at least 3 characters long." };
    return { valid: true };
};

const validateEmail = (val) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) return { valid: false, message: "Please enter a valid email address (e.g., name@domain.com)." };
    return { valid: true };
};

const validatePhone = (val) => {
    if (!/^\d+$/.test(val)) return { valid: false, message: "Phone number must contain only digits." };
    if (val.length !== 10) return { valid: false, message: "Phone number must be exactly 10 digits." };
    return { valid: true };
};

const validateAmount = (val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
        return { valid: false, message: "Please enter a valid amount (e.g., 45.50). Must be greater than 0." };
    }
    return { valid: true };
};
const optionsValidator = (options) => (val) => {
    if (!options.includes(val.trim())) return { valid: false, message: `Please select a valid option: (${options.join(', ')})` };
    return { valid: true };
};

const ask = async (question, defaultAnswer = null, validator = null) => {
    return new Promise((resolve) => {
        const prompt = defaultAnswer ? `${question} [${defaultAnswer}]: ` : `${question}: `;
        
        rl.question(prompt, (answer) => {
            const finalAnswer = answer.trim() || defaultAnswer;

            if (validator) {
                const result = validator(finalAnswer);
                if (!result.valid) {
                    console.log(` ${result.message}`); // Styled in red
                    return resolve(ask(question, defaultAnswer, validator));
                }
            }
            resolve(finalAnswer);
        });
    });
};


const addMyInfo = async () => {
    console.log('\n---Setup Profile ---');
    const firstName = await ask("Your First Name", null, validateName);
    const lastName = await ask("Your Last Name", null, validateName);
    const email = await ask("Your Email", null, validateEmail);
    const phone = await ask("Your Phone Number", null, validatePhone)
    
    currentUser = { firstName, lastName, fullName: `${firstName} ${lastName}`, email };
    console.log(`\n Profile created for ${currentUser.fullName}!`);
};

const addFriend = async () => {
    console.log('\n---Add a Friend ---');
    const firstName = await ask("Friend's First Name", null, validateName);
    const lastName = await ask("Friend's Last Name", null, validateName);
    const email = await ask("Email Address", null, validateEmail);
    const phone = await ask("Phone Number", null, validatePhone);

    friends.push({
        id: Date.now(),
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        balance: 0
    });
    console.log(`\n ${firstName} has been added to your friend list.`);
};

const listFriends = () => {
    if (friends.length === 0) {
        console.log("\nYour friend list is empty.");
        return;
    }

    console.log("\n---Your Friends ---");
    const displayTable = {};
    friends.forEach((f, index) => {
        displayTable[index + 1] = {
            'Name': f.fullName,
            'Email': f.email,
            'Phone': f.phone,
            'Balance': f.balance >= 0 ? `Lent: $${f.balance}` : `Owed: $${Math.abs(f.balance)}`
        };
    });
    console.table(displayTable);
};
const addExpense = async () => {
    if (!currentUser) {
        console.log(" Please 'Add Your Info' before adding expenses.");
        return;
    }
    if (friends.length === 0) {
        console.log("You have no friends to split with. Add a friend first.");
        return;
    }

    console.log('\n---Create New Expense ---');
    const description = await ask("What was this for? (e.g. Dinner)", null, validateName);
    const amountStr = await ask("Total Amount", null, validateAmount);
    const totalAmount = parseFloat(amountStr);

    console.log("\nSelect participants by their Number (comma separated, e.g., 1, 3):");
    listFriends(); 

    const selection = await ask("Participants");
    const indices = selection.split(',').map(s => parseInt(s.trim()));
    
    const participants = [];
    indices.forEach(idx => {
        const friend = friends[idx - 1]; 
        if (friend) participants.push(friend);
    });

    if (participants.length === 0) {
        console.log("No valid friends selected. Expense cancelled.");
        return;
    }

    const splitCount = participants.length + 1;
    const share = totalAmount / splitCount;

    participants.forEach(friend => {
        friend.balance += share; 
    });

    const newExpense = {
        id: `exp_${Date.now()}`,
        description,
        totalAmount: totalAmount.toFixed(2),
        yourShare: share.toFixed(2),
        friendsInvolved: participants.map(p => p.fullName).join(', '),
        date: new Date().toLocaleDateString()
    };
    expenses.push(newExpense);

    console.log(`\nExpense Added: ${description}`);
    console.log(`Each of the ${splitCount} participants owes $${share.toFixed(2)}.`);
};

const listExpenses = () => {
    if (expenses.length === 0) {
        console.log("\nNo expenses recorded yet.");
        return;
    }
    console.log("\n---Expense History ---");
    const displayTable = {};
    expenses.forEach((exp, i) => {
        displayTable[i + 1] = exp;
    });
    console.table(displayTable);
};

const run = async () => {
    const menu = `
1. Add Your Info
2. Add a Friend
3. List Friends
4. Add Expense
5. List Expenses
6. Exit
\nChoice`;

    const choice = await ask(menu, null, optionsValidator(['1', '2', '3', '4', '5', '6']));

    switch (choice) {
        case '1': await addMyInfo(); break;
        case '2': await addFriend(); break;
        case '3': listFriends(); break;
        case '4': await addExpense(); break;
        case '5': listExpenses(); break;
        case '6': 
            console.log("Exit");
            rl.close(); 
            return;
    }
    run(); 
};
run();