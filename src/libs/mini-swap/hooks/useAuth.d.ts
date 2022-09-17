import { ConnectorNames } from 'pancake-uikit';
declare const useAuth: () => {
    login: (connectorID: ConnectorNames) => void;
    logout: () => void;
};
export default useAuth;
