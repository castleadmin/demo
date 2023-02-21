import { render } from '@testing-library/react';

import ItemsSkeleton from './items-skeleton';

describe('ItemsSkeleton', () => {
  it('Should render successfully', () => {
    const { baseElement } = render(<ItemsSkeleton />);
    expect(baseElement).toBeTruthy();
  });
});
