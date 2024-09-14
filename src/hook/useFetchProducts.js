import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchProducts = (searchTerm, pageNumber) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setProducts([]);
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    let cancelRequest;

    axios({
      method: "GET",
      url: "/task/products/search",  // Use relative path
      params: { search: searchTerm, page: pageNumber, limit: 1 },
      headers: {
        "x-api-key": "72njgfa948d9aS7gs5",
      },
      cancelToken: new axios.CancelToken((c) => (cancelRequest = c)),
    })   
      .then((response) => {
        const data = response.data;
        setProducts((prevProducts) => {
          return [...prevProducts, ...data];
        });
        setHasMore(response.data.length > 0);
        setIsLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setIsError(true);
      });

    return () => cancelRequest();
  }, [searchTerm, pageNumber]);

  return { isLoading, isError, products, hasMore };
};
