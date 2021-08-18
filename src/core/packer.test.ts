import fs from 'fs/promises';
import path from 'path';
import theoretically from 'jest-theories';
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
        const outFilePath = path.join(process.cwd(), 'resources/example_output');

        // act
        var result = await Packer.pack(filePath);

        // assert
        var expected = await fs.readFile(outFilePath, {
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

    describe('should throw ApiError when constraint not satisfied', () => {
        const theories = [
            { filePath: 'invalid_weight_limit_input', expected: 'weightLimit should not exceed 100' },
            { filePath: 'invalid_cost_input', expected: 'item cost should not exceed €100' },
            { filePath: 'invalid_weight_input', expected: 'item weight should not exceed 100' },
            { filePath: 'invalid_item_length_input', expected: 'items may not be more than 15' }
        ]

        theoretically('the file input {filePath} throws ApiError', theories, async (theory) => {
            // arrange
            const filePath = path.join(process.cwd(), 'resources', theory.filePath);

            // act
            var result = () => Packer.pack(filePath);

            // assert
            expect(result).rejects.toThrow(theory.expected);
        })
    });
});
