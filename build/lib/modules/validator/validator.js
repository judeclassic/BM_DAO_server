"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
class _BaseValidator {
    constructor() {
        this.dayTimeConstant = 86400000;
        this._validateEmail = (email) => {
            let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Email cannot be null" });
            }
            if (!emailRegex.test(email)) {
                if (/^@/.test(email)) {
                    return ({ status: false, message: "email is inValid (@ is missing)" });
                }
                return ({ status: false, message: "email is inValid" });
            }
            return ({ status: true, data: { email } });
        };
        this._validatePassword = (password) => {
            if (!password) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Password cannot be empty" });
            }
            if (password.length < 6) {
                return ({ status: false, message: "Password is Invalid (password must be greater than 6)" });
            }
            if (password.length > 30) {
                return ({ status: false, message: "Password is Invalid (password must be less than 30)" });
            }
            return ({ status: true, data: { password } });
        };
        this._validateName = (name) => {
            if (!name) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "cannot be null" });
            }
            const names = name.split(" ");
            let firstName = names[0] || undefined;
            let surName = names[1] || undefined;
            let otherName = names[2] || undefined;
            if (!firstName) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "cannot be null" });
            }
            return { status: true, data: { firstName, surName, otherName } };
        };
        this._validateSingleName = (name) => {
            if (!name) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "cannot be null" });
            }
            if (name.length < 3) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "cannot be lest than 3 characters" });
            }
            return { status: true, data: { name } };
        };
        this._validateDescription = (description) => {
            if (!description) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "description cannot be null" });
            }
            if (description.length < 3) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "description cannot be lest than 3 characters" });
            }
            return { status: true, data: { description } };
        };
        this._validateID = (id) => {
            if (!id) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "id cannot be null" });
            }
            if (id.length < 10) {
                return ({ status: false, message: "id cannot be less than 10 characters" });
            }
            if (id.length > 40) {
                return ({ status: false, message: "id cannot be greater than 40 characters" });
            }
            return { status: true, data: { id } };
        };
        this._validateToken = (token) => {
            if (!token) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "id cannot be null" });
            }
            if (token.length < 10) {
                return ({ status: false, message: "Invalid length in Token" });
            }
            return { status: true, data: { token } };
        };
        this._validateKey = (id) => {
            if (!id) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "id cannot be null" });
            }
            if (id.length < 20) {
                return ({ status: false, message: "id cannot be less than 10 characters" });
            }
            if (id.length > 60) {
                return ({ status: false, message: "id cannot be greater than 60 characters" });
            }
            return { status: true, data: { id } };
        };
        this._validateCountry = (country, countries) => {
            if (!country) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Country cannot be empty" });
            }
            if (!countries) {
                countries = [country];
            }
            if (!(countries.find((c) => c === country))) {
                return ({ status: false, message: "country cannot be found in the accepted list of countries" });
            }
            return ({ status: true, data: { country } });
        };
        this._validateCity = (city, cities) => {
            if (!city) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "City cannot be null" });
            }
            if (!cities) {
                return ({ status: false, data: { city }, message: "list of cities returned null" });
            }
            if (!(cities.find((c) => c === city))) {
                return ({ status: false, message: "country cannot be found in the accepted list of cities" });
            }
            return ({ status: true, data: { city } });
        };
        this._validateState = (state, states) => {
            if (!state) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "State cannot be empty" });
            }
            if (!states) {
                states = [state];
            }
            if (!(states.find((s) => s === state))) {
                return ({ status: false, message: "State cannot be found in the accepted list of countries" });
            }
            return ({ status: true, data: { state } });
        };
        this._validateAddress = (address) => {
            if (!address) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Address cannot be null" });
            }
            return ({ status: true, data: { address } });
        };
        this._validatePhone = (phone) => {
            if (!phone) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Phone number cannot be empty" });
            }
            if (phone.length > 14) {
                return ({ status: false, message: "Phone number cannot be greater than 14 characters" });
            }
            if (phone.length < 8) {
                return ({ status: false, message: "Phone number cannot be less than 8 characters" });
            }
            return ({ status: true, data: { phone } });
        };
        this._validateLink = (link) => {
            let linkRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
            if (!link) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Link cannot be null" });
            }
            if (!linkRegex.test(link)) {
                return ({ status: false, message: "Link is Invalid" });
            }
            return ({ status: true, data: { link } });
        };
        this._validateLinkWithLocalHost = (link) => {
            let linkRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
            let localLinkRegex = /^https?:\/\/localhost:[0-9]{1,5}\/([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;
            if (!link) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Link cannot be null" });
            }
            if (!linkRegex.test(link) && !localLinkRegex.test(link)) {
                return ({ status: false, message: "Link is Invalid" });
            }
            return ({ status: true, data: { link } });
        };
        this._validateCallback = (callback) => {
            if (!callback) {
                if (!this.strongChecked) {
                    return ({ status: true });
                }
                return ({ status: false, message: "Callback cannot be null" });
            }
            return ({ status: true, data: { callback } });
        };
        this._validateNumber = (arg) => {
            if (!arg)
                return { status: false, message: 'can not be empty' };
            try {
                parseInt(arg.toString());
            }
            catch (er) {
                return { status: false, message: 'must be an interger' };
            }
            return { status: false };
        };
        this.strongChecked = true;
    }
}
exports.default = _BaseValidator;
