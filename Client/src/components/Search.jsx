import { useState } from "react";
import SearchSvg from "../assets/icons/search.svg";
import CrossSvg from "../assets/icons/cross.svg";

const Search = ({
  searchValue,
  setSearchValue,
  handleSearchChange,
}) => {
  const [showCross, setShowCross] = useState(false);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);

    if (value) {
      setShowCross(true);
    } else {
      setShowCross(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    setShowCross(false)
  };

  return (
    <main className="container -mt-5 -mb-1 xl:-mt-4 ">
      <form className="relative">
        <label htmlFor="search">
          <img
            src={SearchSvg}
            title="Search🔍"
            alt="search"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 md:w-[1.125rem] 2xl:w-5"
          />
        </label>
        <input
          type="text"
          id="search"
          className="w-full duration-300 input pl-10 pr-10 tracking-wide xs:py-2.5 xs:text-base xs:rounded-[0.875rem] md:text-[1.0625rem] xl:text-lg xl:py-2 2xl:py-3 2xl:text-[1.1875rem]"
          value={searchValue}
          title="Tell Me What You're Looking For❓"
          onChange={handleInputChange}
        />
        {showCross && (
          <button type="reset">
            <img
              src={CrossSvg}
              alt="cross"
              onClick={clearSearch}
              title="Clear Search❌"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-[1.625rem] md:w-7 2xl:w-[1.875rem]"
            />
          </button>
        )}
      </form>
    </main>
  );
};

export default Search;