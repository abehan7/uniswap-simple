"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
class Price {
    constructor(price) {
        this.price = price;
        this.decimal = 10 ** 18;
    }
    isDecimal() {
        return this.price.includes(".");
    }
    getDecimalPrice() {
        if (!this.isDecimal())
            return this.price;
        const decimalPriceLength = this.price.split(".")[1].length;
        const decimalPrice = this.price.split(".")[1] + "0".repeat(18 - decimalPriceLength);
        return decimalPrice;
    }
    get Price() {
        if (this.isDecimal())
            return this.getDecimalPrice();
        return (Number(this.price) * this.decimal).toString();
    }
    get Decimal() {
        return this.decimal;
    }
}
exports.Price = Price;
