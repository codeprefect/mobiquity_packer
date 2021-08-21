import { Decimal } from 'decimal.js';

/**
 * an item describes the an item on a line
 */
export class Item {

    /**
     * create a new package item
     * @constructor
     * @param  {number} index
     * @param  {Decimal} weight
     * @param  {Decimal} cost
     */
    constructor(public index: number, public weight: Decimal, public cost: Decimal) {
    }
}
