const { autoInject } = require("async");

import Keyboard from './Keyboard';

const keyboard = new Keyboard('#keyboard');

keyboard.createKeyboard();