import { useState, useEffect, useCallback } from "react";
import { getUser } from "../db/mongodb";

function useFetch(page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);

  const sendQuery = useCallback(async () => {
    try {
      await setLoading(true);
      await setError(false);
    //   const res = await axios.get(
    //     `https://openlibrary.org/search.json?q=${query}&page=${page}`
    //   );
    const user = await getUser();
    const res = await user.functions.get_collections(40, page);
      await setList((prev) => [
        ...new Set([...prev, ...res])
      ]);
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [page]);

  useEffect(() => {
    sendQuery();
  }, [sendQuery, page]);

  return { loading, error, list };
}

export default useFetch;
