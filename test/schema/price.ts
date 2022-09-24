export class Price {
  private price: string;
  private decimal: number;

  constructor(price: string) {
    this.price = price;
    this.decimal = 10 ** 18;
  }

  public isDecimal(): boolean {
    return this.price.includes(".");
  }

  private getDecimalPrice(): string {
    if (!this.isDecimal()) return this.price;
    const decimalPriceLength = this.price.split(".")[1].length;
    const decimalPrice =
      this.price.split(".")[1] + "0".repeat(18 - decimalPriceLength);
    return decimalPrice;
  }

  get Price(): string {
    if (this.isDecimal()) return this.getDecimalPrice();
    return (Number(this.price) * this.decimal).toString();
  }

  get Decimal(): number {
    return this.decimal;
  }
}
