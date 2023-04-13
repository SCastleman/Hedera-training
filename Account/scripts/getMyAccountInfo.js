const {
    Client,
    AccountBalanceQuery
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../.env' });
const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY
const myPublicKey = process.env.MY_PUBLIC_KEY

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    // Create the query
    const query = new AccountBalanceQuery()
     .setAccountId(myAccountId);

    // Sign with the client operator account private key and submit to a Hedera network
    const accountBalance = await query.execute(client);

    if (accountBalance) {
        console.log(`The account balance for account ${myAccountId} is ${accountBalance.hbars} HBar`);

        console.log("All account Info:")
        console.log(JSON.stringify(accountBalance));
    }

    process.exit();
}

main();
