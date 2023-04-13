const {
    Client,
    AccountUpdateTransaction,
    Hbar,
    Key,
    PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../.env' });
// NB: chose not to use environment variables here as this changes public/private key.
const myAccountId = "0.0.4066706"
const myPrivateKey = "302e020100300506032b657004220420333f98093cd0ec417b743b32fe0ebc3834a0398770c762e7d2d832bf804fe43d"

async function main() {
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    const oldKey = PrivateKey.fromStringED25519(myPrivateKey)
    const newKey = await PrivateKey.generateED25519Async();

    const transaction = await new AccountUpdateTransaction()
        .setAccountId(myAccountId)
        .setTransactionMemo("test")
        .setKey(newKey)
        .freezeWith(client)

    const signTx = await (await transaction.sign(oldKey)).sign(newKey)
    const txResponse = await signTx.execute(client)
    const receipt = await txResponse.getReceipt(client)

    console.log("receipt: ", JSON.stringify(receipt))
    const {status, accountId} = receipt
    


    console.log("The account's public key is " + newKey.publicKey)
    console.log("the account's private key is: " + newKey)
    console.log ('transaction consensus status: ' + status)

    process.exit()
}

main();
