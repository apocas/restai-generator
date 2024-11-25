import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FlexAlignCenter } from "app/components/FlexBox";

const Container = styled(FlexAlignCenter)(({ theme }) => ({
  width: 320,
  height: 320,
  overflow: "hidden",
  borderRadius: "300px",
  background: theme.palette.background.default,
  "& span": { fontSize: "4rem" }
}));

export default function EmptyMessage() {
  return (
    <Container>
      <Avatar style={{width: "300px", height: "300px"}} src="/summit/assets/images/genai.jpg"></Avatar>
    </Container>
  );
}
