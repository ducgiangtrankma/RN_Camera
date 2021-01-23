/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Test from './Test';
import CaptureImage from './src/CaptureImages';
AppRegistry.registerComponent(appName, () => CaptureImage);
