import {
  firstLetterToUpperCase,
  replaceSpacesWithSingleWhitespace,
} from './utils';

describe('utils', () => {
  describe('firstLetterToUpperCase', () => {
    it('The first letter should be upper case after the transformation', () => {
      expect(firstLetterToUpperCase('this is a Test TEXT')).toBe(
        'This is a Test TEXT'
      );
    });
    it(`Shouldn't transform the text if it is empty`, () => {
      expect(firstLetterToUpperCase('')).toBe('');
    });
    it(`Shouldn't transform the text if it consists of only 1 letter`, () => {
      expect(firstLetterToUpperCase('a')).toBe('a');
    });
  });

  describe('replaceSpacesWithSingleWhitespace', () => {
    it('Should replace spaces', () => {
      expect(
        replaceSpacesWithSingleWhitespace('This\r\nis     a  Test TEXT')
      ).toBe('This is a Test TEXT');
    });
  });
});
