import { createReadStream } from 'fs';
import { access } from 'fs/promises';
import { createInterface } from 'readline';
import { Decimal } from 'decimal.js';
import { ApiError } from './api_error';
import { Item } from './item';
import { Package } from './package';

export class Packer {
    static async pack(filePath: string): Promise<string> {
        // ensure file exists
        await this.ensureFileExists(filePath);

        // read package into object
        var packages = await this.readPackages(filePath);

        // calculate bestpack for each entry
        return packages.map(pack => this.bestPack(pack))
            .join('\n');
    }

    private static bestPack(pkg: Package): string {
        var eligibleItems = pkg.items.sort((a, b) => a.cost.lessThan(b.cost) ? 1
            : (a.cost.greaterThan(b.cost) ? -1 // sort by cost in decending order
                : (a.weight.greaterThan(b.weight) ? 1
                    : (a.weight.lessThan(b.weight) ? -1 // then sort by weight in ascending order
                        : 0))))
            .filter((item, pos, ary) => item.weight.lessThan(pkg.weightLimit)
                && (!pos || !(item.cost.equals(ary[pos - 1].cost) && Decimal.add(item.weight, ary[pos - 1].weight).greaterThan(pkg.weightLimit)))); // remove heavier item when equal cost and sum of weight exceed weight limit

        // initialize remaining capacity
        var remainingCapacity = pkg.weightLimit;

        // initialize array to store indices of result
        var finalItems: number[] = [];

        // loop through sorted eligible items
        for (var index = 0; index < eligibleItems.length; index++) {
            var currItem = eligibleItems[index]; // get current item

            // check if remaining capacity can allow item
            if (remainingCapacity.greaterThanOrEqualTo(currItem.weight)) {
                finalItems.push(currItem.index); // add item index to result store
                remainingCapacity = remainingCapacity.sub(currItem.weight); // remove item weight from remaining capacity
            }
        }

        // return '-' when there is no eligible item
        return finalItems.length > 0 ? finalItems.sort((a, b) => a > b ? 1 : 0).join(',') : '-';
    }

    // ensure file exists and throw custom exception when not
    private static async ensureFileExists(filePath: string): Promise<void> {
        try {
            await access(filePath);
        } catch {
            throw new ApiError("file not accessible");
        }
    }

    private static async readPackages(filePath: string): Promise<Package[]> {
        // create am interface for readline
        const rlInterface = createInterface({
            input: createReadStream(filePath),
            output: process.stdout,
            terminal: false // to indicate this is not TTY
        });

        // create empty list of package
        var packages = new Array<Package>();

        // 81 : (1,53.38,€45) (2,88.62,€98) (3,78.48,€3) (4,72.30,€76) (5,30.18,€9) (6,46.34,€48)

        // iterate over each line of text in specified file
        for await (const line of rlInterface) {
            // extract weight limit from line
            var step1 = line.split(":");
            var weightLimit = new Decimal(step1[0].trim());

            if (weightLimit.greaterThan(100)) {
                throw new ApiError("weightLimit should not exceed 100");
            }
            // create an instance of package for current line
            // remove empty entries from items
            var items = step1[1].split(" ")
                .filter(text => text != '' )
                .map(item => {
                    var fields = item.slice(1,-1).split(',');
                    var weight = new Decimal(fields[1].trim());
                    var cost = new Decimal(fields[2].slice(1).trim());
                    if (weight.greaterThan(100))
                        throw new ApiError("item weight should not exceed 100");

                    if (cost.greaterThan(100))
                        throw new ApiError("item cost should not exceed €100");
                    return new Item(
                        parseInt(fields[0]), // convert to number for indexNumber
                        weight, // convert to float for weight
                        cost // convert to float for cost
                    );
                });

            if (items.length > 15) throw new ApiError("items may not be more than 15");
            var pkg = new Package(weightLimit, items);

            // added composed packages to list of packages
            packages.push(pkg);
        }

        // return list of packages derived from file
        return packages;
    }
}
