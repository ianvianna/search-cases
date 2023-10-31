import { LightningElement, api, track } from 'lwc';

export default class SearchCases extends LightningElement {

    @api optionsList = [
        { value: 'CaseNumber', label:'Case Number', disabled: false, validation: {
            regexp: /^\d{8}$/,
            example: '10010010'
        }},
        { value: 'CaseID', label:'Case ID', disabled: false, validation: {
            regexp: /^500[0-9A-Za-z]{15}$/,
            example: '500Ab00000abABCAB0'
        }},
    ];
    @track selectedOption = '';
    @track inputError = false;


    // Getters are reactive in LWC:
    get placeholderText() {
        return `Insert the ${this.selectedOption.label} here.`;
    }
    get inputMessageError() {
        return `Enter a valid format, e.g., ${this.selectedOption.validation.example}`;
    }


    // Set default value when initializing page:
    connectedCallback() {
        this.selectedOption = this.getLabelFromValue('CaseNumber');
    }


    // Set the value chosen by the user:
    handleMenuSelect(event) {
        this.selectedOption = this.getLabelFromValue(event.detail.value);
        this.inputError = false;

        const inputElement = this.template.querySelector('[data-id="input-search-case"]');
        inputElement.value = '';
    }


    // Searches for the label corresponding to the value chosen by the user.
    // Disable button to prevent user from choosing the same value:
    getLabelFromValue(value) {
        let foundValue = null;

        this.optionsList.forEach((element) => {
            if(element.value !== value) {
                element.disabled = false;
            } else {
                element.disabled = true;
                foundValue = element;
            }
        });
        return foundValue ? foundValue : '';
    }


    // Validates input value format:
    handleSearchInput(event) {
        if(event.key === 'Enter') {
            if(this.selectedOption.validation.regexp.test(event.target.value)) {
                this.inputError = false;

                // TO-DO: Call method that calls Apex...

            } else {
                this.inputError = true;

                // TO-DO: Change the outline to red...
            }
        }
    }

}