const provider = window.BinanceChain;

if (provider) {
  startApp(provider);
} else {
  console.log('Please install Binance Chain Wallet!');
}

async function startApp(provider) {
  if (provider !== window.BinanceChain) {
    console.error('Do you have multiple wallets installed?');
    return;
  }

  const bscButton = document.querySelector('.enableBSCButton');
  const sendBNBButton = document.querySelector('.sendBNBButton');
  const showAccount = document.querySelector('.showAccount');

  let accounts = [];

  // Send BNB to an address on BSC
  sendBNBButton.addEventListener('click', async () => {
    try {
      const transactionParameters = {
        from: accounts[0], // The user's active address.
        to: '0xb8CfbDc7CBA4517B32bF4834e6148b93006F14d4', // Replace with recipient address on BSC.
        value: '100000000000000000', // Wei equivalent of 0.1 BNB (18 decimal places).
        gasLimit: '0x30D40', // Customizable gas limit.
        gasPrice: '0x3B9ACA00', // Customizable gas price.
      };

      const response = await provider.request({
        method: 'eth_sendTransaction', // Yes, even on BSC you use 'eth_sendTransaction'.
        params: [transactionParameters],
      });

      console.log('Transaction response:', response);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  });

  // Handle user accounts and accountsChanged (per EIP-1193)
  async function handleAccountsChanged(newAccounts) {
    if (newAccounts.length === 0) {
      console.log('Please connect to Binance Chain Wallet.');
    } else if (newAccounts[0] !== currentAccount) {
      currentAccount = newAccounts[0];
      showAccount.innerHTML = currentAccount;
    }
  }

  let currentAccount = null;

  provider.on('accountsChanged', handleAccountsChanged);

  // Enable Binance Chain button click event
  bscButton.addEventListener('click', async () => {
    try {
      accounts = await provider.request({ method: 'eth_requestAccounts' });
      currentAccount = accounts[0];
      showAccount.innerHTML = currentAccount;
    } catch (err) {
      if (err.code === 4001) {
        console.log('Please connect to Binance Chain Wallet.');
      } else {
        console.error(err);
      }
    }
  });
}

