import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import Chat from "./components/Chat";
import SideBar from "./components/SideBar";

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [localChats, setLocalChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const scrollToLastItem = useRef(null);

  const createNewChat = () => {
    setMessage(null);
    setText("");
    setCurrentTitle(null);
  };

  const backToHistoryPrompt = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setText("");
  };

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text) return;

    setIsResponseLoading(true);
    setErrorText("");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: import.meta.env.VITE_AUTH_TOKEN,
      },
      body: JSON.stringify({
        message: text,
      }),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/completions`,
        options
      );

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
    const storedChats = localStorage.getItem("previousChats");

    if (storedChats) {
      setLocalChats(JSON.parse(storedChats));
    }
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

      const updatedChats = [...localChats, newChat, responseMessage];
      localStorage.setItem("previousChats", JSON.stringify(updatedChats));
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
