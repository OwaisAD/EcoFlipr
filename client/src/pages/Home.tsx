import React, { FormEventHandler, useEffect, useState } from "react";
import Header from "../components/Header";
import { useQuery } from "@apollo/client";
import { GET_SALE_OFFERS_BY_SEARCH_QUERY } from "../GraphQL/queries/getSaleOfferBySearchQuery";
import { toast } from "react-hot-toast";
import SearchResults from "../components/SearchResults";
import Carousel from "../components/Carousel";
import { GET_RECENT_SALE_OFFERS_BY_AMOUNT } from "../GraphQL/queries/getRecentSaleOffersByAmount";
import { GET_RANDOM_SALE_OFFERS_BY_AMOUNT } from "../GraphQL/queries/getRandomSaleOffersByAmount";

export const Home = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [runQuery, setRunQuery] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [saleOffers, setSaleOffers] = useState([]);
  const [recentSaleOffers, setRecentSaleOffers] = useState([]);
  const [randomSaleOffers, setRandomSaleOffers] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_SALE_OFFERS_BY_SEARCH_QUERY, {
    variables: { searchQuery, page },
    skip: !runQuery,
  });

  const {
    loading: loading1,
    error: error1,
    data: data1,
    refetch: refetch1,
  } = useQuery(GET_RECENT_SALE_OFFERS_BY_AMOUNT, {
    variables: { amount: 10 },
  });

  const {
    loading: loading2,
    error: error2,
    data: data2,
    refetch: refetch2,
  } = useQuery(GET_RANDOM_SALE_OFFERS_BY_AMOUNT, {
    variables: { amount: 10 },
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

  useEffect(() => {
    if (data1) {
      setRecentSaleOffers(data1.getRecentSaleOffersByAmount);
      console.log(data1);
    }
  }, [data1]);

  useEffect(() => {
    if (data2) {
      setRandomSaleOffers(data2.getRandomSaleOffersByAmount);
      console.log(data2);
    }
  }, [data2]);

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
      {saleOffers ? <SearchResults saleOffers={saleOffers} /> : <></>}

      {/* Display Recent Sale offers */}
      {/* Carousel component that gets data and displays it */}
      {recentSaleOffers ? (
        <div className="w-[900px] mx-auto">
          <p className="text-3xl font-light mb-4 mt-4">Recent sale offers</p>
          <Carousel saleOffers={recentSaleOffers} />
        </div>
      ) : (
        <></>
      )}

      {/* Display Random Sale offers */}
      {/* Carousel component that gets data and displays it */}
      {randomSaleOffers ? (
        <div className="w-[900px] mx-auto">
          <p className="text-3xl font-light mb-4 mt-4">Random sale offers</p>
          <Carousel saleOffers={randomSaleOffers} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
