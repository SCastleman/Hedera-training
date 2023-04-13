const {
    Client,
    AccountCreateTransaction,
    Hbar,
    Key,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../.env' });
const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY

async function main() {
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const key = await PrivateKey.generateED25519Async();

    const transaction = new  AccountCreateTransaction()
        .setKey(key.publicKey)
        .setInitialBalance(new Hbar(10))

    const txResponse = await transaction.execute(client)
    const receipt = await txResponse.getReceipt(client)

    const newAccountId = receipt.accountId

    console.log("The new account is: " + newAccountId)
    console.log("The account's public key is " + key.publicKey)
    console.log("the account's private key is: " + key)

    process.exit()
}

main();
