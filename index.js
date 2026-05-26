import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true);

/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (__DEV__) {
    require('react-native').LogBox.ignoreAllLogs();
  }
