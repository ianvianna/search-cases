import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCaseDetails from '@salesforce/apex/SearchCasesController.getCaseDetails';

export default class SearchCases extends LightningElement {

    @api optionsList = [
        { value: 'CaseNumber', label:'Case Number', disabled: false, validation: {
            regexp: /^\d{8}$/,
            example: '10010010'
        }},
        { value: 'Id', label:'Case ID', disabled: false, validation: {
            regexp: /^500[0-9A-Za-z]{15}$/,
            example: '500Ab00000abABCAB0'
        }},
    ];
    @api result;
    @track selectedOption = '';
    @track inputError = false;
    @track showResult = false;


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
        this.showResult = false;

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
    async handleSearchInput(event) {
        if(event.key === 'Enter') {
            if(this.selectedOption.validation.regexp.test(event.target.value)) {
                event.target.classList.remove('slds-has-error');
                this.inputError = false;

                const result = await this.getCase(event.target.value);
                result ? this.showResult = true : this.showResult = false;
                this.result = result;
            } else {
                event.target.classList.add('slds-has-error');
                this.inputError = true;
            }

            const inputElement = this.template.querySelector('[data-id="input-search-case"]');
            inputElement.value = '';
        }
    }


    // Call the Apex method to query the case:
    async getCase(inputValue) {
        try {
            const result = await getCaseDetails({ caseDetail: inputValue, searchType: this.selectedOption.value });
            this.toastEventGenerator('Success!', `${result.CaseNumber} - Case was found!`, 'success');
            
            return result;
        } catch(error) {
            this.toastEventGenerator('Error!', `${error.body.message} - Case was not found!`, 'error');
        }
    }


    // Display the Toast according to the result:
    toastEventGenerator(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

}