import React, { FormEventHandler, useEffect, useState } from "react";
import Header from "../components/Header";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_SALE_OFFERS_BY_SEARCH_QUERY } from "../GraphQL/queries/getSaleOfferBySearchQuery";
import { toast } from "react-hot-toast";
import SearchResults from "../components/SearchResults";
import Carousel from "../components/Carousel";
import { GET_RECENT_SALE_OFFERS_BY_AMOUNT } from "../GraphQL/queries/getRecentSaleOffersByAmount";
import { GET_RANDOM_SALE_OFFERS_BY_AMOUNT } from "../GraphQL/queries/getRandomSaleOffersByAmount";
import { RxMagnifyingGlass } from "react-icons/rx";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

type Props = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isHeaderSearch: boolean;
  setIsHeaderSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Home = ({ searchQuery, setSearchQuery, isHeaderSearch, setIsHeaderSearch }: Props) => {
  const auth = useAuth();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [saleOffers, setSaleOffers] = useState([]);
  const [saleOfferCount, setSaleOfferCount] = useState(0);
  const [recentSaleOffers, setRecentSaleOffers] = useState([]);
  const [randomSaleOffers, setRandomSaleOffers] = useState([]);
  const [getSaleOffers, { loading, error, data, refetch }] = useLazyQuery(GET_SALE_OFFERS_BY_SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted(data) {
      setSaleOffers(data.getSaleOfferBySearchQuery.saleOffers);
      setPageCount(data.getSaleOfferBySearchQuery.pagination.pageCount);
      setSaleOfferCount(data.getSaleOfferBySearchQuery.pagination.count);
      console.log("NEW DATA", data);
      toast.success(`Found results for ${searchQuery}`);
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

  const executeSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();
    if (!searchQuery) {
      return;
    }

    if (lastSearchQuery !== searchQuery) {
      setPage(1);
      setLastSearchQuery(searchQuery);
      getSaleOffers({ variables: { searchQuery: searchQuery, page: 1 } });
    } else {
      setLastSearchQuery(searchQuery);
      getSaleOffers({ variables: { searchQuery: searchQuery, page: page } });
    }
  };

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

  useEffect(() => {
    if (isHeaderSearch) {
      executeSearch();
      setIsHeaderSearch(false);
    }
  }, [isHeaderSearch]);


  return (
    <div>
      <form onSubmit={executeSearch} className="relative flex justify-center items-center mt-10 p-3 ">
        <div>
          <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
            <RxMagnifyingGlass className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items..."
            className="rounded-lg border-none h-16 w-80 text-xl bg-gray-50 block  pl-10 sm:text-md border-gray-300 focus:ring-black focus:border-black"
            value={searchQuery}
          />
        </div>
      </form>

      {/* Display search results in SearchResults component*/}
      <div className="flex flex-col items-center mb-20">
        {saleOffers && saleOffers.length > 0 ? (
          <SearchResults
            page={page}
            pageCount={pageCount}
            saleOfferCount={saleOfferCount}
            searchQuery={searchQuery}
            saleOffers={saleOffers}
            setSaleOffers={setSaleOffers}
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
          <p className="text-3xl font-light mb-4 mt-4 text-center lg:text-left dark:text-white">Recent sale offers</p>
          <Carousel rowID="1" saleOffers={recentSaleOffers} />
        </div>
      ) : (
        <></>
      )}

      {/* Display Random Sale offers */}
      {/* Carousel component that gets data and displays it */}
      {randomSaleOffers ? (
        <div className="sm:w-[600px] md:w-[700px] lg:w-[900px] mx-auto mb-20">
          <p className="text-3xl font-light mb-4 mt-4 text-center lg:text-left dark:text-white">Random sale offers</p>
          <Carousel rowID="2" saleOffers={randomSaleOffers} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
