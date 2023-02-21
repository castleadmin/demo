import { render } from '@testing-library/react';

import ItemSkeleton from './item-skeleton';

describe('ItemSkeleton', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<ItemSkeleton />);
    expect(baseElement).toBeTruthy();
  });
});
