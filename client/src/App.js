import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import "./App.css";
import Chat from "./components/Chat";
import SideBar from "./components/SideBar";
import { fetchAllChatTitles, fetchChatsByTitle } from "./services/apiService"; // Import your API service

function App() {
  const [text, setText] = useState("");
  const [activeChat, setActiveChat] = useState([]);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [localChats, setLocalChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollToLastItem = useRef(null);

  const createNewChat = () => {
    setMessage(null);
    setText("");
    setCurrentTitle(null);
  };

  const backToHistoryPrompt = async (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setText("");

    // Fetch the chats for the selected title
    try {
      const chats = await fetchChatsByTitle(uniqueTitle);
      setPreviousChats(chats);
    } catch (error) {
      setErrorText("Failed to load chats.");
      console.error(error);
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text) return;

    setIsLoading(true);
    setIsResponseLoading(true);
    setErrorText("");

    const payload = {
      title: currentTitle || "New Chat",
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
        setErrorText(data.error.message);
        setText("");
      } else {
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

  // Fetch all chat titles on component mount
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const chats = await fetchAllChatTitles();
        setLocalChats(chats); // Use API response to set localChats
      } catch (error) {
        console.error("Failed to fetch chat titles:", error);
      }
    };

    fetchTitles();
  }, []);

  useEffect(() => {
    if (!currentTitle && text && message) {
      setCurrentTitle(text);
    }

    if (currentTitle && text && message) {
      const newChat = {
        title: currentTitle,
        role: "user",
        content: text,
      };

      const responseMessage = {
        title: currentTitle,
        role: message.role,
        content: message.content,
      };

      setPreviousChats((prevChats) => [...prevChats, newChat, responseMessage]);
      setLocalChats((prevChats) => [...prevChats, newChat, responseMessage]);

      // Here you could also post the new chat to your backend if needed
    }
  }, [message, currentTitle]);

  const currentChat = (localChats || previousChats).filter(
    (prevChat) => prevChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat) => prevChat.title).reverse())
  );

  const localUniqueTitles = Array.from(
    new Set(localChats.map((prevChat) => prevChat.title).reverse())
  ).filter((title) => !uniqueTitles.includes(title));

  return (
    <div className="container">
      <SideBar
        setCurrentTitle={setCurrentTitle}
        setPreviousChats={setPreviousChats}
        uniqueTitles={uniqueTitles}
        localUniqueTitles={localUniqueTitles}
        createNewChat={createNewChat}
        backToHistoryPrompt={backToHistoryPrompt}
        isShowSidebar={isShowSidebar}
        toggleSidebar={toggleSidebar}
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
