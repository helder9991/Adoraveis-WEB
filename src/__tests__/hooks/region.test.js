import { renderHook, act } from '@testing-library/react-hooks';

import { RegionProvider, useRegion } from '../../hooks/region';

describe('Region Hook', () => {
  it('should be able to set a region', () => {
    const { result } = renderHook(() => useRegion(), {
      wrapper: RegionProvider,
    });

    act(() =>
      result.current.setRegion({
        institute: 'institute-123',
        logo: 'logo-123',
        url_param: 'url_param-123',
      }),
    );

    expect(result.current.region.institute).toBe('institute-123');
  });

  it('should be able to save a selected region', () => {
    const region = {
      institute: 'institute-123',
      logo: 'logo-123',
      url_param: 'url_param-123',
    };

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    setItemSpy.mockClear();

    const { result } = renderHook(() => useRegion(), {
      wrapper: RegionProvider,
    });

    act(() => result.current.saveRegion(region));

    expect(setItemSpy).toHaveBeenCalledWith(
      '@Adoraveis:region',
      JSON.stringify(region),
    );
  });

  it('should be able remove region from storage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() =>
      JSON.stringify({
        institute: 'institute-123',
        logo: 'logo-123',
        url_param: 'url_param-123',
      }),
    );

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    removeItemSpy.mockClear();

    const { result } = renderHook(() => useRegion(), {
      wrapper: RegionProvider,
    });

    act(() => {
      result.current.removeRegion();
    });

    expect(removeItemSpy).toHaveBeenCalledWith('@Adoraveis:region');
    expect(result.current.region.logo).toBeUndefined();
  });

  it('should be able to restore data from storage when inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() =>
      JSON.stringify({
        institute: 'institute-123',
        logo: 'logo-123',
        url_param: 'url_param-123',
      }),
    );

    const { result } = renderHook(() => useRegion(), {
      wrapper: RegionProvider,
    });

    expect(result.current.region.logo).toBe('logo-123');
  });
});
