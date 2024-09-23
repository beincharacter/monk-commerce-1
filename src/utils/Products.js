import { useEffect, useState, useCallback, useMemo } from 'react';

export const useFetchProducts = (searchTerm, pageNumber, setPageNumber) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const headers = useMemo(() => {
    const h = new Headers();
    h.append('x-api-key', '72njgfa948d9aS7gs5');
    return h;
  }, []);

  const resetProducts = useCallback(() => {
    setProducts([]);
    setPageNumber(1);
  }, [setPageNumber]);

  useEffect(() => {
    resetProducts();
  }, [searchTerm, resetProducts]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(`https://stageapi.monkcommerce.app/task/products/search?search=${searchTerm}&page=${pageNumber}&limit=10`, {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      });

      console.log('Response:', response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data:', data);

      // Check if `data` is an array before spreading
      if (Array.isArray(data)) {
        setProducts((prevProducts) => [...prevProducts, ...data]);
        setHasMore(data.length > 0);
      } else {
        console.warn('Expected data to be an array but received:', data);
        setHasMore(false); 
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, pageNumber, headers]);

  useEffect(() => {
    if (searchTerm || pageNumber) {
      fetchProducts();
    }
  }, [fetchProducts, searchTerm, pageNumber]);

  return { isLoading, isError, products, hasMore };
};
