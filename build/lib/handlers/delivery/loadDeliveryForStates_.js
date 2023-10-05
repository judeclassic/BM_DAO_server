"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderPriceFor = void 0;
const Istore_response_1 = require("../../../types/interfaces/response/Istore.response");
const generateOrderPriceFor = (state) => {
    switch (state) {
        case Istore_response_1.AvailableStateEnum.abia:
            return {
                cake: 1850,
                orders: 1850,
            };
        case Istore_response_1.AvailableStateEnum.abuja:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.adamawa:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.akwaIbom:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.anambra:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.bauchi:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.bayelsa:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.benue:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.borno:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.cross:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.delta:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.ebonyi:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.edo:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.ekiti:
            return {
                cake: 1500,
                orders: 1200,
            };
        case Istore_response_1.AvailableStateEnum.enugu:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.gombe:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.imo:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.jigawa:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.kaduna:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.kano:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.katsina:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.kebbi:
            return {
                cake: 1850,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.kogiState:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.kwaraState:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.lagos:
            return {
                cake: 1500,
                orders: 1200,
            };
        case Istore_response_1.AvailableStateEnum.nasarawa:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.niger:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.ogun:
            return {
                cake: 1500,
                orders: 1200,
            };
        case Istore_response_1.AvailableStateEnum.ondo:
            return {
                cake: 1500,
                orders: 1200,
            };
        case Istore_response_1.AvailableStateEnum.osun:
            return {
                cake: 1500,
                orders: 1200,
            };
        case Istore_response_1.AvailableStateEnum.oyo:
            return {
                cake: 1500,
                orders: 1200,
            };
        case Istore_response_1.AvailableStateEnum.plateau:
            return {
                cake: 2000,
                orders: 1200,
            };
        case Istore_response_1.AvailableStateEnum.rivers:
            return {
                cake: 1850,
                orders: 1450,
            };
        case Istore_response_1.AvailableStateEnum.sokoto:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.taraba:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.yobe:
            return {
                cake: 2000,
                orders: 1700,
            };
        case Istore_response_1.AvailableStateEnum.zamfara:
            return {
                cake: 1850,
                orders: 1450,
            };
    }
};
exports.generateOrderPriceFor = generateOrderPriceFor;
