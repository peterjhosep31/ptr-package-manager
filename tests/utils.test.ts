import { describe, it, expect } from 'vitest';
import { arrayEnd } from '../packages/utils/ArrayUtils.ts';
import { searchCutEnd, capitalizeWords } from '../packages/utils/StringUtils.ts';

describe('ArrayUtils', () => {
    describe('arrayEnd', () => {
        it('should return the last element of the array', () => {
            expect(arrayEnd([1, 2, 3])).toBe(3);
            expect(arrayEnd(['a', 'b'])).toBe('b');
        });

        it('should return null for empty arrays', () => {
            expect(arrayEnd([])).toBeNull();
        });

        it('should return null for undefined or null inputs', () => {
            expect(arrayEnd(null as any)).toBeNull();
            expect(arrayEnd(undefined as any)).toBeNull();
        });
    });
});

describe('StringUtils', () => {
    describe('searchCutEnd', () => {
        it('should cut string from the end of the search value', () => {
            expect(searchCutEnd('hello//world', '//')).toBe('world');
            expect(searchCutEnd('abc def', 'c ')).toBe('def');
        });

        it('should return null if search value is not found', () => {
            expect(searchCutEnd('hello', '//')).toBeNull();
        });
    });

    describe('capitalizeWords', () => {
        it('should capitalize words properly', () => {
            expect(capitalizeWords('hello world how are you')).toBe('HelloWorldhowareyou'); 
            expect(capitalizeWords('this is an awesome project')).toBe('ThisisanAwesomeProject');
        });
    });
});
