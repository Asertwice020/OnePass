import PasswordBoxCard from "../components/PasswordBoxCard";
import Search from "../components/Search";
import GroupSvg from "../assets/icons/group.svg";
import AppSvg from "../assets/icons/apps.svg";
import DocumentSvg from "../assets/icons/document.svg";
import CardSvg from "../assets/icons/card.svg";
import WorkSvg from "../assets/icons/work.svg";
import { useEffect, useState } from "react";
import PasswordCard from "../components/PasswordCard";
import { getPasswordCardsData } from "../api/axios";
import {useSelector, useDispatch} from "react-redux"
import { setAllStoredPasswords } from "../redux/Slices/storedPasswordsSlice";
import Filter from "../components/Filter";

const HomePage = () => {
  const dispatch = useDispatch();

  const storedPasswordsFromRedux = useSelector(
    (state) => state.storedPasswords
  );

  const [searchValue, setSearchValue] = useState("");
  const [passwordCardsData, setPasswordCardsData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [categoriesPasswordCount, setCategoriesPasswordCount] = useState({});
  const [activeBox, setActiveBox] = useState("Stored");

  // Fetch password list
  useEffect(() => {
    getPasswordList();
  }, [storedPasswordsFromRedux.passwordCount]);

  // METHOD: FETCH PASSWORDS FROM DB AND PROCESSING IT TO THE DESIRED FORMAT.
  const getPasswordList = async () => {
    try {
      let data = await getPasswordCardsData();

      // Map the data to the desired format
      const processedDataToCards = data.storedPasswords.map((item) => ({
        id: item._id,
        title: item.title,
        category: item.category,
        email: item.email,
        note: item.note,
        createdAt: item.createdAt,
      }));

      // DISPATCH: RAW DATA FROM DB TO REDUX STORE.
      dispatch(setAllStoredPasswords(data));
      setPasswordCardsData(processedDataToCards);
      setSearchResult(processedDataToCards);
    } catch (error) {
      console.log("Error fetching password list:", error);
    }
  };

  // Update search results whenever search value or password cards change
  useEffect(() => {
    handleSearchChange();
  }, [searchValue]);

  // METHOD: SEARCH PASSWORDS BY TITLE, EMAIL, AND CATEGORY, NOTES.
  const handleSearchChange = () => {
    if (!searchValue) {
      setSearchResult(passwordCardsData);
    } else {
      const resultArray = passwordCardsData.filter(
        (cardData) =>
          cardData.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          cardData.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          cardData.note.toLowerCase().includes(searchValue.toLowerCase()) ||
          cardData.category.toLowerCase().includes(searchValue.toLowerCase())
      );

      setSearchResult(resultArray);
    }
  };

  const categories = ["social", "work", "apps", "documents", "cards"];

  const getPasswordCountOfCategory = () => {
    const result = categories.reduce((acc, category) => {
      const count = storedPasswordsFromRedux.allStoredPasswords.filter(
        (cardData) =>
          cardData.category &&
          cardData.category.toLowerCase() === category.toLowerCase()
      ).length;
      acc[category] = count;
      return acc;
    }, {});

    setCategoriesPasswordCount(result);
  };

  useEffect(() => {
    getPasswordCountOfCategory();
  }, [storedPasswordsFromRedux.passwordCount]);

  const handleCategoryClick = (category) => {
    getActiveBox(category);
    const result = passwordCardsData.filter((cardData) => {
      return cardData.category.toLowerCase() === category.toLowerCase();
    });

    setSearchResult(result);
  };

  const getActiveBox = (boxIdentifier) => {
    const boxesArray = [
      "Stored",
      "Compromised",
      "Social",
      "Work",
      "Apps",
      "Documents",
      "Cards",
    ];
    if (!boxesArray || !boxIdentifier) return;
    boxesArray.includes(boxIdentifier) && setActiveBox(boxIdentifier);
  };

  const categoryCardsData = [
    {
      id: 0,
      // I NEED HERE OVERALL STORED PASSWORD ON MY ACCOUNT INCLUDING COMPROMISED PASSWORDS.
      length: storedPasswordsFromRedux.passwordCount,
      text1: "Passwords",
      text2: "Stored",
    },
    {
      id: 1,
      icon: GroupSvg,
      name: "Social",
      savedPasswordCount: categoriesPasswordCount.social,
    },
    {
      id: 2,
      icon: AppSvg,
      name: "Apps",
      savedPasswordCount: categoriesPasswordCount.apps,
    },
    {
      id: 3,
      icon: WorkSvg,
      name: "Work",
      savedPasswordCount: categoriesPasswordCount.work,
    },
    {
      id: 4,
      icon: DocumentSvg,
      name: "Documents",
      savedPasswordCount: categoriesPasswordCount.documents,
    },
    {
      id: 5,
      icon: CardSvg,
      name: "Cards",
      savedPasswordCount: categoriesPasswordCount.cards,
    },
    {
      id: "compromisedPasswords",
      length: storedPasswordsFromRedux.compromisedPasswordCount,
      text1: "Passwords",
      text2: "Compromised",
    },
  ];

  return (
    <main className="main-with-header flex flex-col flex-wrap gap-5">
      <PasswordBoxCard
        categoryCardsData={categoryCardsData}
        handleCategoryClick={handleCategoryClick}
        getActiveBox={getActiveBox}
        activeBox={activeBox}
        setSearchResult={setSearchResult}
      />
      <Search
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearchChange={handleSearchChange}
      />
      <Filter
        searchResult={searchResult}
        activeBox={activeBox}
        setSearchResult={setSearchResult}
      />
      <PasswordCard searchResult={searchResult} />
    </main>
  );
};

export default HomePage;