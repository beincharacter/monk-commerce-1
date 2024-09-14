import axios from 'axios';
import { useEffect, useState } from 'react';

export const useFetchProducts = (searchTerm, pageNumber, setPageNumber) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setProducts([]);
    setPageNumber(1);
  }, [searchTerm, setPageNumber]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await axios.get('/task/products/search', {
          params: { search: searchTerm, page: pageNumber, limit: 10 },
          headers: { 'x-api-key': '72njgfa948d9aS7gs5' },
        });

        setProducts((prevProducts) => [
          ...prevProducts,
          ...response.data,
        ]);
        setHasMore(response.data.length > 0);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, pageNumber, setPageNumber]);

  return { isLoading, isError, products, hasMore };
};
