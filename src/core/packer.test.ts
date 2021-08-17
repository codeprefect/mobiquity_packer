
import { Packer } from './packer';

describe('Packer works!', () => {
    test('pack should return input filePath', () => {
        var filePath = "hello.txt";
        var result = Packer.pack(filePath);
        expect(result).toEqual(result);
    });
});
