// console.log("WHAT")
// setTimeout(()=>{
//     console.log("exit")
// },5000);

// console.log("WHAT")
// setInterval(()=>{
//     console.log("exit")
// },5000);


// const readline = require('node:readline');
// const { stdin: input, stdout: output } = require('node:process');

// const rl = readline.createInterface({ input, output });

// const run =async()=>{
//     console.log("what's your name?");
//     const answer=await Promise.resolve("hello");
// }
// run()


// const readline = require('node:readline');
// const { stdin: input, stdout: output } = require('node:process');

// const rl = readline.createInterface({ input, output });

// const run =async()=>{
//     console.log("what's your name?");
//     const answer=await rl.question('');
//     console.log(`Hello,${answer}!`);
// }
// run()

// const readline = require('node:readline');
// const { stdin: input, stdout: output } = require('node:process');

// const rl = readline.createInterface({ input, output });

// const run =async()=>{
//     console.log("what's your name?");
//     const answer=await rl.question("what's your name ?",(answer)=>{
//         console.log(`Hello,${answer}!`);

//     });
    
// }
// run()


// const readline = require('node:readline');
// const { stdin: input, stdout: output } = require('node:process');

// const rl = readline.createInterface({ input, output });

// const ask =async(question)=>{
//     return new Promise((resolve)=>{
//         rl.question(question,(answer)=>{
//             resolve(answer);

//         });
//     });
// }

// const run=async()=>{
//     const name=await ask('what is your name?');
//     console.log(`Hello,${name}!`);
//     const age=await ask('what is your age?');
//     console.log(`You are ,${age}years old`);
//     rl.close();
// }
// run()

// const run=async()=>{
//     const version=await ask('version:');
//     const description=await ask('description');
//     const entry_point=await ask('entry point: (index.js)');
//     const test_command=await ask('test command:');
//     const git_repository=await ask('git repository');
//     const author=await ask('author');
//     const license=await ask('license: (ISC)')

//     const packageConfig = {
//   "name": "sanmitha",
//   "version": "1.0.0",
//   "description": "",
//   "main": "index.js",
//   "author": "",
//   "license": "ISC",
//   "type": "commonjs"
// }
    
//     console.log("\nAbout to write to mypackage.json:\n");
//     console.log(JSON.stringify(packageConfig, null, 2));

//     rl.close();
// }
// run();  

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const numberValidator=(input)=>{
    const num= parseInt(input,10)
    return !isNaN(input)
}


const optionsValidator=(options)=>{
    return (input)=>{
        return options.includes(input);
    }
}

const ask=async(question,defaultAnswer,validator)=>{
    return new Promise((resolve)=>{
        rl.question(question+` ${defaultAnswer ? '('+defaultAnswer+')':''}`,(answer)=>{
            if(validator && !validator(answer)){
                console.log('Invalid input.Please try again.');
                return resolve(ask(question,defaultAnswer,validator));
            }
            resolve(answer|| defaultAnswer);
        });

    });


}

// const run  =async()=>{
//     const name=await ask('what is your name?','SS');
//     console.log(`Hello,${name}!`);

//     const age=await ask('How old are you?','18',numberValidator);
//     console.log(`You are ${age} years old.`);

//     const gender=await ask('what is your gender?\n1.Male\n2.Female\n3.Other\n','1',optionsvalidator(['1','2','3']));
//     console.log(``)

// )
// }

const printMonth=()=>{
    const monthNames=["January","February","March","April","May","June","July",
        "August","September","October","November","December"
    ];
    const month=new Date().getMonth();
    console.log(`Current month: ${monthNames[month]}`);
}
const printYear=()=>{
    const year=new Date().getFullYear();
    console.log(`Current day: ${day}`);
}

const printDayOfWeek=()=>{
    const dayNames=["Sunday","Monday","Tuesday","WEdnesday","Thursday","Friday","Saturday","Sunday"];
    const dayOfWeek=new Date().getDay();
    console.log(`Current day of week:${dayNames[dayOfWeek]}`);
}

const run =async()=>{
    const prompt='What about the current date? \n Options:\n\t1.Month\n\t2.Year\n\t3. Day\n\t4.Week\n\t5.Exit\n Your Choice';
    const choice=await ask(prompt,null,optionsValidator(['1','2','3','4','5']));

    switch (choice){
        case '1':
            printMonth();
            break;
        case '2':
            printYear();
            break;
        case '3':
            printDay();
            break;
        case '4':
            printDayOfWeek();
            break;
        case '5':
            console.log('byee');
            rl.close();
            return;
    }
    // rl.close();
}
run();
        
