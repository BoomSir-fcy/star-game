import { useEffect, useState } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from 'config/wallet'
import useAuth from 'hooks/useAuth'

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

const useEagerConnect = () => {
  const { login } = useAuth()

  const [isInit, setInit] = useState(false) // 解决重复调用

  useEffect(() => {
    if (isInit) return
    setInit(true)
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames
    if (connectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => login(connectorId))

        return
      }
      login(connectorId)
    }
  }, [login, isInit])
}

export default useEagerConnect
