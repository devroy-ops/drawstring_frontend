import { connect, Contract, keyStores, WalletConnection, nearAPI } from 'near-api-js';
import getConfig from '../config';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { nftMethods, marketMethods } from '../Constants/contractMethods';
const APP_NAME = 'Drawstring'
let available;

const nearConfig = getConfig(process.env.NODE_ENV !== undefined);

 export const marketContractName = 'drawstring_market.testnet';//'drawstringnft.testnet';

// Initialize contract & set global variables
export async function initContracts() {
  // Initialize connection to the NEAR testnet
  const near = await connect({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() }, ...nearConfig });

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.isSignedIn()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),

    };
  } else {
    currentUser = {
      accountId: "stingy.testnet",//'stingy.testnet',
    };
  }

  const account = await near.account(currentUser.accountId);
  const balance = await account.getAccountBalance()
   available = formatNearAmount(balance.available);
  const user = walletConnection.getAccountId()
 
  // await account.addKey("8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc");
  const keys = await account.getAccessKeys();
  // console.log(keys);

  const data = await account.state();
  const codeHash = data.code_hash.split("");

  const containsContract = codeHash.every((el) => el === "1");

  if (!containsContract) {
    //alert("This account contains a smart contract");
    console.log("This account contains a smart contract");
  } else {
	  console.log("This account doesnt contain a smart contract");
  }

  const contractX = await new Contract(
    walletConnection.account(),
    //nearConfig.CONTRACT_NAME,
    "deploycontract1.testnet",
    {
      changeMethods: ["deploy_contract_code"],
    }
  );

  // Initializing our contract APIs by contract name and configuration
  const nftContract = await new Contract(walletConnection.account(), 'manmade.drawstringnft.testnet', {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: [...nftMethods.viewMethods],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: [...nftMethods.changeMethods],
    // Sender is the account ID to initialize transactions.
    sender: walletConnection.getAccountId(),
  });

  // Initializing our contract APIs by contract name and configuration
  const marketContract = await new Contract(
    walletConnection.account(),
    marketContractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: [...marketMethods.viewMethods],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: [...marketMethods.changeMethods],
      // Sender is the account ID to initialize transactions.
      sender: walletConnection.getAccountId(),
    }
  );

  return {
    nftContract,
    marketContract,
    currentUser,
    nearConfig,
    walletConnection,
    near,
  	contractX,
    account,
  };
}
export function balance() {
   return available;
};
export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.CONTRACT_NAME, APP_NAME);
}