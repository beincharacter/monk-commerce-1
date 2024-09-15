import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

export const useFetchProducts = (searchTerm, pageNumber, setPageNumber) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

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
      const { data } = await axios.get('/task/products/search', {
        params: { search: searchTerm, page: pageNumber, limit: 10 },
        headers: { 'x-api-key': process.env.REACT_APP_API_KEY },
      });

      setProducts((prevProducts) => [...prevProducts, ...data]);
      setHasMore(data.length > 0);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, pageNumber]);

  useEffect(() => {
    if (searchTerm || pageNumber === 1) {
      fetchProducts();
    }
  }, [fetchProducts, searchTerm, pageNumber]);

  return { isLoading, isError, products, hasMore };
};
