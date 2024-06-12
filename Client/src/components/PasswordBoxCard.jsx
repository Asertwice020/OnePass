import { useSelector } from "react-redux";

const PasswordBoxCard = ({
  categoryCardsData,
  handleCategoryClick,
  getActiveBox,
  activeBox,
  setSearchResult,
}) => {
  const { allStoredPasswords, allCompromisedPasswords } = useSelector(
    (state) => state.storedPasswords
  );
  const lastIndex = categoryCardsData.length - 1;

  const setSearchResultHandler = (data) => {
    getActiveBox(data.text2);

    data.text2 === "Stored" && setSearchResult(allStoredPasswords);
    data.text2 === "Compromised" && setSearchResult(allCompromisedPasswords);
  };

  return (
    <div className="container select-none grid place-items-center xxs:grid-cols-1 xxs:gap-5 base:grid-cols-2 base:gap-5 base:order xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 h-[11.25rem] overflow-y-auto">
      {categoryCardsData.map((data, index) =>
        index === 0 || index === lastIndex ? (
          <div
            key={data.id}
            title={`👀See All "${data.text2}" Passwords🔑`}
            onClick={() => setSearchResultHandler(data)}
            className={`bg-color-4 h-40 aspect-square rounded-3xl duration-300 pl-3 cursor-pointer ${
              lastIndex && "base:order-first xs:order-none"
            } ${
              activeBox == data.text2
                ? "border-color-9 border-[1px] shadow"
                : "border-[1px] border-transparent"
            }`}
          >
            <h1 className="text-color-1 h1">{data.length}</h1>
            <div className="pt-4">
              <p className="text-color-2 font-medium font-poppins">
                {data.text1}
              </p>
              <p className="text-color-2 font-medium font-poppins">
                {data.text2}
              </p>
            </div>
          </div>
        ) : (
          <div
            key={data.id}
            onClick={() => handleCategoryClick(data.name)}
            title={`👀See "${data.name}" Passwords🔑`}
            className={`bg-color-6 h-40 aspect-square rounded-3xl p-5 cursor-pointer duration-300 ${
              activeBox == data.name
                ? "border-color-9 border-[1px] shadow"
                : "border-[1px] border-transparent"
            }`}
          >
            <img
              src={data.icon}
              className="w-12 p-3 rounded-xl bg-color-3"
              alt="icon"
            />
            <div className="pt-7">
              <p className="text-black font-semibold font-poppins">
                {data.name}
              </p>
              <p className="text-black font-poppins">
                {`${data.savedPasswordCount} Passwords`}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PasswordBoxCard;