const util = require('util');

function validateExpense(expenseObj) {
    const isValid = {
        status: false,
        msg: 'Data Undefined or null'
    }
    if(util.isNullOrUndefined(expenseObj)){
        return isValid;
    } else{
        if(util.isNullOrUndefined(expenseObj.category)) {
            isValid.msg = "Category missing";
        } else if (util.isNullOrUndefined(expenseObj.title)) {
            isValid.msg = "Title missing";
        } else if (util.isNullOrUndefined(expenseObj.amount)) {
            isValid.msg = "Amount missing";
        } else if (util.isNullOrUndefined(expenseObj.exp_date)) {
            isValid.msg = "Exp Date missing";
        } else {
            isValid.status = true;
            isValid.msg = "Valid";
        }
    }
    return isValid;
}

module.exports = {
    validateExpense
}