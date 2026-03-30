const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const optionsValidator = (options) => (input) => options.includes(input);

const ask = async (question, defaultAnswer, validator) => {
    return new Promise((resolve) => {
        rl.question(`${question} ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}: `, (answer) => {
            if (validator && !validator(answer)) {
                console.log('Invalid input. Please try again.');
                return resolve(ask(question, defaultAnswer, validator));
            }
            resolve(answer || defaultAnswer);
        });
    });
};

const emailValidator = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
const phoneValidator = (input) => /^\d{10}$/.test(input);
const nameValidator = (input) => input.trim().length > 0;

let friends = []; 

const addFriend = async () => {
    const firstName = await ask("First Name", null, nameValidator);
    const lastName = await ask("Last Name", null, nameValidator);;
    const email = await ask("Friend's Email", null, emailValidator);
    const phone = await ask("Friend's Phone (10 digits)", null, phoneValidator);

    friends.push({ firstName,lastName,fullName: `${firstName} ${lastName}`, email, phone });
    console.log(`\n Added ${firstName} ${lastName} successfully!`);
};
const clearData = async () => {
    const confirm = await ask("Are you sure you want to clear all friends? (yes/no)", "no");
    if (confirm.toLowerCase() === 'yes') {
        friends = [];
        console.log("All data has been wiped clean.");
    } else {
        console.log("Operation cancelled.");
    }
};

const run = async () => {
    const choice = await ask(
        '\n1. Add Friend\n2. View All Friends\n3. Exit\n4. Clear\nChoice', 
        null, 
        optionsValidator(['1', '2', '3', '4'])
    );
    

    switch (choice) {
        case '1':
            await addFriend();
            break;

        case '2':
            if (friends.length === 0) {
                console.log("\n No friends found.");
            } else {
                console.log("\n--- Friend List ---");
                console.table(friends);
            }
            break;

        case '3':
            const confirm = await ask("Are you sure you want to clear all data? (yes/no)", "no");
            if (confirm.toLowerCase() === 'yes') {
                friends = [];
                console.log(" Data  clean.");
            }
            break;

        case '4':
            console.log("Exit!");
            rl.close();
            return; 

        default:
            
            console.log("Invalid selection.");
            break;
    }

    run(); 
};

   

run();