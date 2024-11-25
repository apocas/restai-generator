import { styled, Card } from "@mui/material";
import { MatxSidenavContent } from "app/components/MatxSidenav";
import { MatxSidenavContainer } from "app/components/MatxSidenav";
import ImageChatContainer from "./components/ImageChatContainer";
import { useEffect } from "react";

const Container = styled("div")(({ theme }) => ({
  margin: 10,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));


export default function Image() {
  useEffect(() => {
    document.title = (process.env.REACT_APP_RESTAI_NAME || "RESTai") + ' - Image Generation';
  }, []);

  return (
    <Container>
      <Card elevation={6}>
        <MatxSidenavContainer>
          <MatxSidenavContent>
            <ImageChatContainer />
          </MatxSidenavContent>
        </MatxSidenavContainer>
      </Card>
    </Container>

  );
}
