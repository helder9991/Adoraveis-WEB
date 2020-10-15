import { renderHook, act } from '@testing-library/react-hooks';

import { CategoryProvider, useCategory } from '../../hooks/category';

describe('Category Hook', () => {
  it('should be able to change category', () => {
    const { result } = renderHook(() => useCategory(), {
      wrapper: CategoryProvider,
    });

    expect(result.current.category).toBe('adopt');
    act(() => result.current.changeCategory());
    expect(result.current.category).toBe('missing');
  });
});
