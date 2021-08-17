import fs from 'fs/promises';
import path from 'path';
import { Packer } from './packer';

describe('Packer works!', () => {
    test('pack should return input filePath', async () => {
        // arrange
        var filePath = path.join(process.cwd(), 'resources/example_input');

        // act
        var result = await Packer.pack(filePath);

        // assert
        expect(result).toEqual(result);
    });

    test('pack should return expected result', async () => {
        // arrange
        const filePath = path.join(process.cwd(), 'resources/example_input');

        // act
        var result = await Packer.pack(filePath);

        // assert
        var expected = await fs.readFile(filePath, {
            encoding: 'utf-8'
        });

        expect(result).toEqual(expected);
    });

    test('should try api error when file not exist', async () => {
        // arrange
        const filePath = path.join(process.cwd(), 'resources/hello');

        // act
        var result = () => Packer.pack(filePath);

        // assert
        expect(result).rejects.toThrow("file not accessible");
    });
});
