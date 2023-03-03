/**
 * /**
 * @file ioc-symbols-input-port.ts
 * @description This file contains the symbols for the controllers. Controllers are used
 * to execute the use cases.
 */
const CONTROLLERS = {
    USERPASS_LOGIN: Symbol.for("UserPassLoginController"),
    MULTIVO: Symbol.for("MultiVOController"),
}

export default CONTROLLERS;
