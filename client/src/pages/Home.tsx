import React, { FormEventHandler, useEffect, useState } from "react";
import Header from "../components/Header";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_SALE_OFFERS_BY_SEARCH_QUERY } from "../GraphQL/queries/getSaleOfferBySearchQuery";
import { toast } from "react-hot-toast";
import SearchResults from "../components/SearchResults";
import Carousel from "../components/Carousel";
import { GET_RECENT_SALE_OFFERS_BY_AMOUNT } from "../GraphQL/queries/getRecentSaleOffersByAmount";
import { GET_RANDOM_SALE_OFFERS_BY_AMOUNT } from "../GraphQL/queries/getRandomSaleOffersByAmount";

export const Home = () => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [saleOfferCount, setSaleOfferCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [saleOffers, setSaleOffers] = useState([]);
  const [recentSaleOffers, setRecentSaleOffers] = useState([]);
  const [randomSaleOffers, setRandomSaleOffers] = useState([]);
  const [getSaleOffers, { loading, error, data, refetch }] = useLazyQuery(GET_SALE_OFFERS_BY_SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setSaleOffers(data.getSaleOfferBySearchQuery.saleOffers);
      setPageCount(data.getSaleOfferBySearchQuery.pagination.pageCount);
      setSaleOfferCount(data.getSaleOfferBySearchQuery.pagination.count);
      toast.success(`Found results for ${searchQuery}`)
    },
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

  const executeSearch: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      return;
    }
    getSaleOffers({ variables: { searchQuery: searchQuery, page: page } })
  };

  useEffect(() => {
    if (data) {
      setSaleOffers(data.getSaleOfferBySearchQuery.saleOffers);
      setPageCount(data.getSaleOfferBySearchQuery.pagination.pageCount);
      setSaleOfferCount(data.getSaleOfferBySearchQuery.pagination.count);
    }
  }, [data]);

  useEffect(() => {
    if (data1) {
      setRecentSaleOffers(data1.getRecentSaleOffersByAmount);
    }
  }, [data1]);

  useEffect(() => {
    if (data2) {
      setRandomSaleOffers(data2.getRandomSaleOffersByAmount);
    }
  }, [data2]);

  return (
    <div>
      <Header />
      <h1>Home</h1>
      <br />

      <form onSubmit={executeSearch} className="flex flex-col items-center mt-2">
        <input
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for items..."
          className="rounded-lg border-none h-16 w-72 text-xl"
          value={searchQuery}
        />
      </form>

      {/* Display search results in SearchResults component*/}
      <div className="flex flex-col items-center mb-20">
        {saleOffers && saleOffers.length > 0 ? (
          <SearchResults
            page={page}
            pageCount={pageCount}
            searchQuery={searchQuery}
            saleOfferCount={saleOfferCount}
            saleOffers={saleOffers}
            setPage={setPage}
            getSaleOffers={getSaleOffers}
          />
        ) : (
          <></>
        )}
      </div>

      {/* Display Recent Sale offers */}
      {/* Carousel component that gets data and displays it */}
      {recentSaleOffers ? (
        <div className="sm:w-[600px] md:w-[700px] lg:w-[900px] mx-auto">
          <p className="text-3xl font-light mb-4 mt-4">Recent sale offers</p>
          <Carousel rowID="1" saleOffers={recentSaleOffers} />
        </div>
      ) : (
        <></>
      )}

      {/* Display Random Sale offers */}
      {/* Carousel component that gets data and displays it */}
      {randomSaleOffers ? (
        <div className="sm:w-[600px] md:w-[700px] lg:w-[900px] mx-auto mb-20">
          <p className="text-3xl font-light mb-4 mt-4">Random sale offers</p>
          <Carousel rowID="2" saleOffers={randomSaleOffers} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
