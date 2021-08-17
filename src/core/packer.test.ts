import fs from 'fs/promises';
import path from 'path';
import { Packer } from './packer';

describe('Packer works!', () => {
    test('pack should return input filePath', () => {
        // arrange
        var filePath = "hello.txt";

        // act
        var result = Packer.pack(filePath);

        // assert
        expect(result).toEqual(result);
    });

    test('pack should return expected result', async () => {
        // arrange
        const filePath = 'resources/example_input';

        // act
        var result = Packer.pack(path.join(__dirname, filePath));

        // assert
        var expected = await fs.readFile(filePath, {
            encoding: 'utf-8'
        });

        expect(result).toEqual(expected);
    });
});
