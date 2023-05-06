import React, { FormEventHandler, useEffect, useState } from "react";
import Header from "../components/Header";
import { useQuery } from "@apollo/client";
import { GET_SALE_OFFERS_BY_SEARCH_QUERY } from "../GraphQL/queries/getSaleOfferBySearchQuery";
import { toast } from "react-hot-toast";
import SearchResults from "../components/SearchResults";

export const Home = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [runQuery, setRunQuery] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [saleOffers, setSaleOffers] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_SALE_OFFERS_BY_SEARCH_QUERY, {
    variables: { searchQuery, page },
    skip: !runQuery,
  });

  const executeSearch: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setRunQuery(true);
  };

  useEffect(() => {
    if (runQuery) {
      refetch();
      setRunQuery(false);
    }
  }, [runQuery]);

  useEffect(() => {
    if (data) {
      setSaleOffers(data.getSaleOfferBySearchQuery.saleOffers);
      console.log(data);
    }
  }, [data]);

  return (
    <div>
      <Header />
      <h1>Home</h1>
      <br />
      <form onSubmit={executeSearch}>
        <h3>Search...</h3>
        <input type="text" onChange={(e) => setSearchQuery(e.target.value)} />
      </form>

      {/* Display search results in SearchResults component*/}
      {saleOffers ? <SearchResults saleOffers={saleOffers}/> : <></>}

      {/* Display Recent Sale offers */}
      {/* Carousel component that gets data and displays it */}
      {/* Display Random Sale offers */}
      {/* Carousel component that gets data and displays it */}
    </div>
  );
};
