import { Decimal } from "decimal.js";
import { Item } from "./item";

/**
 * create a package
 */
export class Package {
    items: Item[];

    /**
     * create a new package object
     */
    constructor(weightLimit: Decimal);
    constructor(weightLimit: Decimal, items: Item[]);
    constructor(public weightLimit: Decimal, items?: Item[])
    {
        this.items = items == undefined ? [] : items;
    }
}
