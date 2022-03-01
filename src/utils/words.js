import faker from '@faker-js/faker';

export const createFakeWords = (count = 15) => {
  return new Array(count)
    .fill()
    .map((el) => faker.random.word())
    .join(' ');
};
