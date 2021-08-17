import { createReadStream } from 'fs';
import { access } from 'fs/promises';
import { createInterface } from 'readline';
import { ApiError } from './api_error';
import { Item } from './item';
import { Package } from './package';

export class Packer {
    static async pack(filePath: string): Promise<string> {
        // ensure file exists
        await this.ensureFileExists(filePath);

        var packages = await this.readPackages(filePath);

        return packages.map(pack => this.bestPack(pack))
            .join('\n');
    }

    private static bestPack(pkg: Package): string {
        console.log(pkg);
        // return '-' when there is no eligible item
        return '-';
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
            var weightLimit = parseFloat(step1[0]);
            // create an instance of package for current line
            // remove empty entries from items
            var items = step1[1].split(" ")
                .filter(text => text != '' )
                .map(item => {
                    var fields = item.slice(1,-1).split(',');
                    return new Item(
                        parseInt(fields[0]), // convert to number for indexNumber
                        parseFloat(fields[1]), // convert to float for weight
                        parseFloat(fields[2].slice(1)) // convert to float for cost
                    );
                });
            var pkg = new Package(weightLimit, items);

            // added composed packages to list of packages
            packages.push(pkg);
        }

        // return list of packages derived from file
        return packages;
    }
}
