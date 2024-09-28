import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import "./App.css";
import Chat from "./components/Chat";
import SideBar from "./components/SideBar";
import { fetchAllChatTitles, fetchChatsByChatId } from "./services/apiService";

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [localChats, setLocalChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollToLastItem = useRef(null);
  const [uniqueTitles, setUniqueTitles] = useState([]);

  const createNewChat = () => {
    setMessage(null);
    setText("");
    setCurrentTitle(null);
    setCurrentChatId(null); // Reset the chat ID
    setPreviousChats([]);
  };

  // Fetch chats when currentTitle changes
  // useEffect(() => {
  //   const fetchChats = async () => {
  //     if (currentTitle) {
  //       try {
  //         const chats = await fetchChatsByChatId(currentChatId);
  //         // setPreviousChats(chats);
  //       } catch (error) {
  //         setErrorText("Failed to load chats.");
  //         console.error(error);
  //       }
  //     }
  //   };

  //   fetchChats();
  // }, [currentTitle]);

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const handleRename = (oldTitle, newTitle) => {
    setPreviousChats((prev) =>
      prev.map((chat) =>
        chat.title === oldTitle ? { ...chat, title: newTitle } : chat
      )
    );
    setLocalChats((prev) =>
      prev.map((chat) =>
        chat.title === oldTitle ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text) return;

    setIsLoading(true);
    setIsResponseLoading(true);
    setErrorText("");

    const newChatId = currentChatId ? currentChatId : uuidv4();
    setCurrentChatId(newChatId);
    // Use currentChatId if it's already set
    const payload = {
      chat_id: newChatId, // Use the existing chat ID
      title: currentTitle || text, // Set title to currentTitle or text
      role: "user",
      content: text,
    };

    try {
      const response = await fetch("http://localhost:8000/api/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        return setErrorText("Too many requests, please try again later.");
      }

      const data = await response.json();

      if (data.error) {
        setUniqueTitles([]);
        setErrorText(data.error.message);
        setText("");
      } else {
        setUniqueTitles([{ chat_id: newChatId, title: text }]);
        setErrorText("");
        setMessage(data.choices[0].message);

        setTimeout(() => {
          scrollToLastItem.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
          });
        }, 1);
        setTimeout(() => {
          setText("");
          setIsLoading(false);
        }, 2);
      }
    } catch (e) {
      setErrorText(e.message);
      console.error(e);
    } finally {
      setIsResponseLoading(false);
    }
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsShowSidebar(window.innerWidth <= 640);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const chats = await fetchAllChatTitles();
        setLocalChats(chats);

        // console.log(uniqueTitles);
      } catch (error) {
        console.error("Failed to fetch chat titles:", error);
      }
    };

    fetchTitles();
  }, []);
  // console.log("localChats : ", localChats);
  useEffect(() => {
    if (!currentTitle && text && message) {
      setCurrentTitle(text); // Set title to the text input
      //setCurrentChatId(uuidv4()); // Generate a unique ID for the new chat
    }

    if (currentTitle && text && message) {
      const newChat = {
        chat_id: currentChatId, // Use the unique chat ID
        title: currentTitle, // Keep the title same
        role: "user",
        content: text,
      };

      const responseMessage = {
        chat_id: currentChatId, // Use the same chat ID for response
        title: currentTitle,
        role: message.role,
        content: message.content,
      };

      setPreviousChats((prevChats) => [...prevChats, newChat, responseMessage]);
      setLocalChats((prevChats) => [...prevChats, newChat, responseMessage]);
    }
  }, [message, currentTitle]);

  // console.log("current title before setting currentChat: ", currentTitle);
  // const currentChat = (localChats || previousChats).filter(
  //   (prevChat) => prevChat.title === currentTitle
  // );
  const currentChat = previousChats.filter(
    (prevChat) => prevChat.title === currentTitle
  );

  // console.log("current chat:", currentChat);
  // console.log("previous chat below setting current Chat", previousChats);
  // console.log("local chat below setting current chat:", localChats);

  // useEffect(() => {
  //   const unique = Array.from(
  //     new Set(previousChats.map((prevChat) => prevChat.title).reverse())
  //   );
  //   setUniqueTitles(unique);
  // }, [previousChats]);

  // useEffect(() => {
  //   const uniqueTitlesMap = {};

  //   const uniqueTitles = previousChats
  //     .map((prevChat) => ({
  //       title: prevChat.title,
  //       chat_id: prevChat.chat_id,
  //     }))
  //     .reverse() // Reverse if you want the latest chats first
  //     .filter((chat) => {
  //       // Check if the title already exists in the map
  //       if (!uniqueTitlesMap[chat.title]) {
  //         uniqueTitlesMap[chat.title] = true; // Mark this title as seen
  //         return true; // Keep this chat object
  //       }
  //       return false; // Discard duplicatesx
  //     });

  //   setUniqueTitles(uniqueTitles);
  // }, [previousChats]);

  // console.log("previous chat ", previousChats);

  // const localUniqueTitles = Array.from(
  //   new Set(localChats.map((prevChat) => prevChat.title).reverse())
  // ).filter((title) => !uniqueTitles.includes(title));

  // const localUniqueTitles = localChats.map((chat) => ({
  //   title: chat.title,
  //   chat_id: chat.chat_id,
  // }));

  const localUniqueTitles = Array.from(
    new Set(
      localChats
        .map((prevChat) =>
          JSON.stringify({ title: prevChat.title, chat_id: prevChat.chat_id })
        ) // Create a unique string for each chat
        .reverse()
    )
  )
    .map((item) => JSON.parse(item)) // Parse back to object
    .filter(
      (chat) =>
        !uniqueTitles.some((uniqueChat) => uniqueChat.chat_id === chat.chat_id)
    );
  // console.log("Local Unique Titles :", localUniqueTitles);
  // console.log("Unique Titles : ", uniqueTitles);
  return (
    <div className="container">
      <SideBar
        previousChats={previousChats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        handleRename={handleRename}
        setCurrentTitle={setCurrentTitle}
        setPreviousChats={setPreviousChats}
        uniqueTitles={uniqueTitles}
        localUniqueTitles={localUniqueTitles}
        createNewChat={createNewChat}
        isShowSidebar={isShowSidebar}
        toggleSidebar={toggleSidebar}
        setUniqueTitles={setUniqueTitles}
        localChats={localChats}
        setLocalChats={setLocalChats}
        currentTitle={currentTitle}
      />
      <Chat
        currentChat={currentChat}
        text={text}
        setText={setText}
        isResponseLoading={isResponseLoading}
        submitHandler={submitHandler}
        errorText={errorText}
        scrollToLastItem={scrollToLastItem}
        isLoading={isLoading}
      />
      {isShowSidebar ? (
        <MdOutlineArrowRight
          className="burger"
          size={28.8}
          onClick={toggleSidebar}
        />
      ) : (
        <MdOutlineArrowLeft
          className="burger"
          size={28.8}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default App;
