const dotenv = require("dotenv");
dotenv.config();
const {
    Client,
    AccountBalanceQuery,
    AccountDeleteTransaction,
    PublicKey,
    Hbar,
    PrivateKey
} = require("@hashgraph/sdk");
const utils = require("../../utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY, PUBLIC_KEY } = utils.loadAccountCredentials();

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);

    const privateKey = PrivateKey.fromString(PRIVATE_KEY)

    //Create the transaction to delete an account
    const transaction = await new AccountDeleteTransaction()
        .setAccountId("0.0.4078904")
        .setTransferAccountId(ACCOUNT_ID)
        .freezeWith(client);

    //Sign the transaction with the account key
    const signTx = await transaction.sign(privateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " +transactionStatus);
}

main();