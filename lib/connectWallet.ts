export const ALFAJORES_PARAMS = {
    chainId: '0xaef3', // 44787
    chainName: 'Celo Alfajores Testnet',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
    blockExplorerUrls: ['https://alfajores.celoscan.io'],
  };
  
  export const switchToAlfajores = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error("No wallet found");
      return;
    }
  
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ALFAJORES_PARAMS.chainId }],
      });
    } catch (switchError: any) {
      // If the chain is not added yet, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ALFAJORES_PARAMS],
          });
        } catch (addError) {
          console.error("Failed to add chain", addError);
        }
      } else {
        console.error("Failed to switch chain", switchError);
      }
    }
  };
  