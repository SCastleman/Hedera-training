const {
    Client,
    AccountBalanceQuery,
    TransferTransaction,
    Hbar,
    PrivateKey,
    AccountId
} = require("@hashgraph/sdk");

const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY

const otherAccountId = "0.0.4078555"
const otherPrivateKey = "302e020100300506032b657004220420414eb0357f2faf33e8b1d51049f8749e7e33d419cabef0b5b8ce7c8bc3608d57"

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(otherAccountId, otherPrivateKey);

    const nodeId = []

    nodeId.push(new AccountId(2))

    // Create the transfer transaction
    const transaction = new TransferTransaction()
    console.log('here')
    .addHbarTransfer(myAccountId, new Hbar(-10))
    .addHbarTransfer(otherAccountId, new Hbar(10))
    .setNodeAccountIds(nodeId)

    const frozenTransaction = transaction.freezeWith(client)

    const signerKey1 = PrivateKey.fromStringED25519(myPrivateKey)
    const signerKey2 = PrivateKey.fromStringED25519(otherPrivateKey)
    console.log(signerKey1, signerKey2)

    const signature1 = signerKey1.signTransaction(frozenTransaction)
    const signature2 = signerKey2.signTransaction(frozenTransaction)

    const signedTransaction = transaction.addSignature(signerKey1.publicKey, signature1).addSignature(signerKey2.publicKey, signerKey2)

    console.log("public keys that signed transaction:", signedTransaction.getSignatures())
    
    console.log(`Doing transfer from ${myAccountId} to ${otherAccountId}`);
    
    // Sign with the client operator key and submit the transaction to a Hedera network
    const submittedTransction = await signedTransaction.execute(client);

    const txId = submittedTransction.transactionId.toString()
    
    console.log("transaction id is", txId)
}

main();
