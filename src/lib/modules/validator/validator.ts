//@ts-check
class _BaseValidator {
    strongChecked: boolean;
    protected readonly dayTimeConstant = 86400000;

    constructor() {
        this.strongChecked = true;
    }

    protected _validateEmail = (email?: string) => {
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!email) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Email cannot be null"});
        }
        if (!emailRegex.test(email)) {
            if (/^@/.test(email)) {
                return ({status: false, message: "email is inValid (@ is missing)"});
            }
            return ({status: false, message: "email is inValid"});
        }
        return ({status: true, data: {email}});
    }

    protected _validatePassword = (password?: string) => {

        if (!password ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Password cannot be empty"});
        }
        if (password.length < 6) {
            return ({status: false, message: "Password is Invalid (password must be greater than 6)"});
        }
        if (password.length > 30) {
            return ({status: false, message: "Password is Invalid (password must be less than 30)"});
        }
        return ({status: true, data: {password}});
    }

    protected _validateName = (name?: string) => {
        if (!name) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "cannot be null"});
        }
        const names = name.split(" ");
        let firstName = names[0] || undefined;
        let surName = names[1] || undefined;
        let otherName = names[2] || undefined;

        if (!firstName) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "cannot be null"});
        }

        return { status: true, data: {firstName, surName, otherName} }
    }

    protected _validateSingleName = (name?: string) => {
        if (!name) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "cannot be null"});
        }

        if (name.length < 3) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "cannot be lest than 3 characters"});
        }

        return { status: true, data: {name} }
    }

    protected _validateDescription = (description?: string) => {
        if (!description) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "description cannot be null"});
        }

        if (description.length < 3) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "description cannot be lest than 3 characters"});
        }

        return { status: true, data: {description} }
    }

    protected _validateID = (id?: string) => {
        if (!id) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "id cannot be null"});
        }

        if ( id.length < 10 ) {
            return ({status: false, message: "id cannot be less than 10 characters"});
        }

        if ( id.length > 40 ) {
            return ({status: false, message: "id cannot be greater than 40 characters"});
        }

        return { status: true, data: {id} }
    }

    protected _validateToken = (token?: string) => {
        if (!token) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "id cannot be null"});
        }

        if ( token.length < 10 ) {
            return ({status: false, message: "Invalid length in Token"});
        }

        return { status: true, data: {token} }
    }

    protected _validateKey = (id?: string) => {
        if (!id) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "id cannot be null"});
        }

        if ( id.length < 20 ) {
            return ({status: false, message: "id cannot be less than 10 characters"});
        }

        if ( id.length > 60 ) {
            return ({status: false, message: "id cannot be greater than 60 characters"});
        }

        return { status: true, data: {id} }
    }

    protected _validateCountry = (country?: string, countries?: string[]) => {
        if (!country) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Country cannot be empty"});
        }
        if (!countries) {
            countries = [country];
        }
        if (!(countries.find((c) => c === country ))) {
            return ({status: false, message: "country cannot be found in the accepted list of countries"});
        }

        return ({status: true, data: {country}});
    }

    protected _validateCity = (city?: string, cities?: string[]) => {
        if (!city) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "City cannot be null"});
        }
        if (!cities) {
            return ({status: false, data: {city}, message: "list of cities returned null"});
        }
        if (!(cities.find((c) => c === city))) {
            return ({status: false, message: "country cannot be found in the accepted list of cities"});
        }

        return ({status: true, data: {city}});
    }

    protected _validateState = (state?: string, states?: string[]) => {
        if (!state) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "State cannot be empty"});
        }
        if (!states) {
            states = [state]
        }
        if (!(states.find((s) => s === state))) {
            return ({status: false, message: "State cannot be found in the accepted list of countries"});
        }

        return ({status: true, data: {state}});
    }

    protected _validateAddress = (address?: string) => {

        if (!address ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Address cannot be null"});
        }
        return ({status: true, data: {address}});
    }

    protected _validatePhone = (phone?: string) => {

        if (!phone ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Phone number cannot be empty"});
        }
        if (phone.length > 14 ) {
            return ({status: false, message: "Phone number cannot be greater than 14 characters"});
        }
        if (phone.length < 8 ) {
            return ({status: false, message: "Phone number cannot be less than 8 characters"});
        }
        return ({status: true, data: {phone}});
    }

    protected _validateLink = (link?: string) => {
        let linkRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

        if (!link ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Link cannot be null"});
        }
        if (!linkRegex.test(link)) {
            return ({status: false, message: "Link is Invalid"});
        }
        return ({status: true, data: {link}});
    }

    protected _validateLinkWithLocalHost = (link?: string) => {
        let linkRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
        let localLinkRegex = /^https?:\/\/localhost:[0-9]{1,5}\/([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/

        if (!link ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Link cannot be null"});
        }

        if (!linkRegex.test(link) && !localLinkRegex.test(link)) {
            return ({status: false, message: "Link is Invalid"});
        }
        return ({status: true, data: {link}});
    }

    protected _validateCallback = (callback: (...arg: any[]) => any) => {

        if (!callback ) {
            if (!this.strongChecked) {
                return ({status: true});
            }
            return ({status: false, message: "Callback cannot be null"});
        }
        
        return ({status: true, data: {callback}});
    }

    protected _validateNumber = (arg: number) => {

        if (!arg) return { status: false, message: 'can not be empty' };
        try {
            parseInt(arg.toString());
        } catch (er) {
            return { status: false, message: 'must be an interger' };
        }
        return { status: false }
    }
    
    
}

export default _BaseValidator;