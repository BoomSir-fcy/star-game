import { useContext } from 'react'
import { ConnectWallet } from './Provider'

const useConnectWallet = () => {
  const { onConnectWallet } = useContext(ConnectWallet)
  return { onConnectWallet }
}

export default useConnectWallet
