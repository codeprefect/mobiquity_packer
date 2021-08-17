import { Item } from "./item";

/**
 * create a package
 */
export class Package {

    /**
     * create a new package object
     */
    constructor(public weightLimit: number, public items: Item[])
    {
    }
}
