import { render } from "preact";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faUsers,
  faSearch,
  faPaperPlane,
  faTerminal,
  faCircleNotch,
  faXmark,
  faPenToSquare,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import App from "./App";

if (import.meta.env.MODE === "development") {
  import("preact/debug");
}

library.add({
  faUser,
  faUsers,
  faSearch,
  faPaperPlane,
  faTerminal,
  faCircleNotch,
  faXmark,
  faPenToSquare,
  faUserGroup,
});

render(<App />, document.body);
