const Filter = ({ searchResult, activeBox, setSearchResult, className }) => {
  const aToZFilterHandler = () => {
    const sortedArray = [...searchResult].sort((a, b) => a.title.trim().localeCompare(b.title.trim()));
    
    searchResult && setSearchResult(sortedArray);
  };
  
  const newToOldFilterHandler = () => {
    const sortedArray = [...searchResult].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    searchResult && setSearchResult(sortedArray);
  };

  const oldToNewFilterHandler = () => {
    const sortedArray = [...searchResult].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    searchResult && setSearchResult(sortedArray);
  };

  const filterCategories = [
    {
      id: 1,
      title: "A-Z",
      handler: () => aToZFilterHandler(),
    },
    {
      id: 2,
      title: "New To Old",
      handler: () => newToOldFilterHandler(),
    },
    {
      id: 3,
      title: "Old To New",
      handler: () => oldToNewFilterHandler(),
    },
  ];

  return (
    <main
      className={`container flex items-center -mb-2 -mt-1 overflow-x-auto gap-x-4 ${className} ${searchResult.length === 0 && "hidden"}`}
    >
      {filterCategories.map((item) => (
        <button
          key={item.id}
          className="text-nowrap border-2 px-3 py-2 border-color-1 font-poppins text-xs rounded-xl duration-300 focus:bg-color-1 focus:text-white"
          onClick={item.handler}
        >
          {item.title}
        </button>
      ))}
    </main>
  );
};

export default Filter