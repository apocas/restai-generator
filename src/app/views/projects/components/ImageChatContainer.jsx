import { Box, Divider, Fab, IconButton, MenuItem, styled, TextField, CircularProgress } from "@mui/material";
import { Delete, MoreVert, Send } from "@mui/icons-material";
import { Fragment, useState } from "react";
import Scrollbar from "react-perfect-scrollbar";
import shortid from "shortid";
import ModalImage from "react-modal-image";


import MatxMenu from "app/components/MatxMenu";
import ChatAvatar from "app/components/ChatAvatar";
import { Paragraph, Span } from "app/components/Typography";
import { FlexAlignCenter, FlexBetween } from "app/components/FlexBox";
import ImageEmptyMessage from "./ImageEmptyMessage";
import useAuth from "app/hooks/useAuth";
import { useEffect } from "react";
import sha256 from 'crypto-js/sha256';
import CustomizedDialogMessage from "./CustomizedDialogMessage";
import CustomizedDialogImage from "./CustomizedDialogImage";
import { toast } from 'react-toastify';

const ChatRoot = styled(Box)(() => ({
  height: 800,
  display: "flex",
  position: "relative",
  flexDirection: "column",
  background: "rgba(0, 0, 0, 0.05)"
}));

const LeftContent = styled(FlexBetween)(({ theme }) => ({
  padding: "4px",
  background: theme.palette.primary.main
}));

const UserName = styled("h5")(() => ({
  color: "#fff",
  fontSize: "18px",
  fontWeight: "500",
  whiteSpace: "pre",
  marginLeft: "16px"
}));

const UserStatus = styled("div")(({ theme, human }) => ({
  padding: "8px 16px",
  marginBottom: "8px",
  borderRadius: "4px",
  color: human === true && "#fff",
  background: human === true ? theme.palette.primary.main : theme.palette.background.paper
}));

const StyledItem = styled(MenuItem)(() => ({
  display: "flex",
  alignItems: "center",
  "& .icon": { marginRight: "16px" }
}));

const ScrollBox = styled(Scrollbar)(() => ({
  flexGrow: 1,
  position: "relative"
}));

const Message = styled("div")(() => ({
  display: "flex",
  alignItems: "flex-start",
  padding: "12px 16px"
}));

const MessageBox = styled(FlexAlignCenter)(() => ({
  flexGrow: 1,
  height: "100%",
  flexDirection: "column"
}));

export default function ImageChatContainer({
  generators,
  opponentUser = {
    name: "A.I.",
    avatar: "/summit/assets/images/painter.jpg"
  }
}) {
  const url = process.env.REACT_APP_RESTAI_API_URL || "";
  const auth = useAuth();
  const GENERATOR = process.env.REACT_APP_RESTAI_GENERATOR || "dalle";

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [canSubmit, setCanSubmit] = useState(true);
  const [scroll, setScroll] = useState();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleMessageSend = (message) => {
    handler(message);
  }

  const handler = (prompt) => {
    var body = {
      "prompt": prompt
    };

    if (canSubmit) {
      setCanSubmit(false);
      setMessages([...messages, { id: body.id, prompt: prompt + " (" + GENERATOR + ")", answer: null, sources: [] }]);
      fetch(url + "/image/" + GENERATOR + "/generate", {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Basic ' + auth.user.token }),
        body: JSON.stringify(body),
      })
        .then(function (response) {
          if (!response.ok) {
            response.json().then(function (data) {
              toast.error(data.detail);
            });
            throw Error(response.statusText);
          } else {
            return response.json();
          }
        })
        .then((response) => {
          if (!response.prompt) {
            response.prompt = prompt + " (" + GENERATOR + ")";
          }
          setMessages([...messages, response]);
          setCanSubmit(true);
        }).catch(err => {
          toast.error(err.toString());
          setMessages([...messages, { id: null, prompt: prompt, answer: "Error, something went wrong with my transistors.", sources: [] }]);
          setCanSubmit(true);
        });
    }
  }

  const handleClickMessage = (message) => {
    setSelectedMessage(message);
  }

  const handleClickImage = (image) => {
    setSelectedImage(image);
  }

  const handleMessageInfoClose = () => {
    setSelectedMessage(null);
  }

  const handleImageInfoClose = () => {
    setSelectedImage(null);
  }

  const sendMessageOnEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      let tempMessage = message.trim();
      if (tempMessage !== "") handleMessageSend(tempMessage);
      setMessage("");
    }
  };


  useEffect(() => {
    if (scroll) {
      scroll.scrollTop = Number.MAX_SAFE_INTEGER
    }
  }, [messages]);

  return (
    <ChatRoot>
      <CustomizedDialogMessage message={selectedMessage} onclose={handleMessageInfoClose} />
      <CustomizedDialogImage image={selectedImage} onclose={handleImageInfoClose} />

      <LeftContent>
        <Box display="flex" alignItems="center" pl={2}>
          <Fragment>
            <ChatAvatar src={opponentUser.avatar} />
            <UserName>
              {GENERATOR.toUpperCase()}
            </UserName>
          </Fragment>
        </Box>


        <Box>
          <MatxMenu
            menuButton={
              <IconButton size="large" sx={{ verticalAlign: "baseline !important" }}>
                <MoreVert sx={{ color: "#fff" }} />
              </IconButton>
            }>

            <StyledItem>
              <Delete className="icon" /> Clear Chat
            </StyledItem>
          </MatxMenu>
        </Box>
      </LeftContent>

      <ScrollBox id="chat-message-list" containerRef={setScroll}>
        {messages.length === 0 && (
          <MessageBox>
            <ImageEmptyMessage />
            <p>Write an image idea...</p>
            <p>(There is no memory of previous messages)</p>
          </MessageBox>
        )}

        {messages.map((message, index) => (
          <Fragment>
            <Message key={shortid.generate()}>
              <ChatAvatar src={"http://www.gravatar.com/avatar/" + sha256(auth.user.username)} />

              <Box ml={2}>
                <Paragraph m={0} mb={1} color="text.secondary">
                  {"Me"}
                </Paragraph>

                <UserStatus human={true} >
                  <Span sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.prompt}</Span>
                </UserStatus>
              </Box>
            </Message>

            <Message key={shortid.generate()}>
              <ChatAvatar src={opponentUser.avatar} />

              <Box ml={2}>
                <Paragraph m={0} mb={1} color="text.secondary">
                  {opponentUser.name}
                </Paragraph>

                <UserStatus human={false} >
                  <Span sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", cursor: 'pointer' }} value={message} onClick={() => handleClickMessage(message)}>{!message.image ? <CircularProgress size="1rem" /> : message.prompt}</Span>
                  {message.image && (
                    <ModalImage
                      small={`data:image/jpg;base64,${message.image}`}
                      large={`data:image/jpg;base64,${message.image}`}
                      alt="Image preview"
                      maxHeight="200px"
                    />
                  )}
                </UserStatus>
              </Box>
            </Message>
          </Fragment>
        ))}
      </ScrollBox>

      <Divider />

      <Box px={2} py={1} display="flex" alignItems="center">
        <TextField
          rows={1}
          fullWidth
          value={message}
          multiline={true}
          variant="outlined"
          onKeyUp={sendMessageOnEnter}
          label="Type your prompt here..."
          onChange={(e) => setMessage(e.target.value)}
        />

        <div style={{ display: "flex" }}>
          <Fab
            onClick={() => {
              if (message.trim() !== "") handleMessageSend(message);
              setMessage("");
            }}
            color="primary"
            sx={{ ml: 2 }}>
            <Send />
          </Fab>
        </div>
      </Box>

    </ChatRoot>
  );
}
