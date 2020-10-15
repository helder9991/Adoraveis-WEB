import { renderHook, act } from '@testing-library/react-hooks';

import { HeaderProvider, useHeader } from '../../hooks/header';

describe('Header Hook', () => {
  it('should be able to change visibility header', () => {
    const { result } = renderHook(() => useHeader(), {
      wrapper: HeaderProvider,
    });

    expect(result.current.header).toBe(true);
    act(() => result.current.changeHeader(false));
    expect(result.current.header).toBe(false);
  });
});
