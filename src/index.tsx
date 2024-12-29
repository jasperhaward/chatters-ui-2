import { render } from "preact";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faUsers,
  faSearch,
  faArrowRight,
  faTerminal,
  faCircleNotch,
  faXmark,
  faPen,
  faUserGroup,
  faRightFromBracket,
  faCircleHalfStroke,
  faAngleLeft,
  faEllipsisVertical,
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
  faArrowRight,
  faTerminal,
  faCircleNotch,
  faXmark,
  faPen,
  faUserGroup,
  faRightFromBracket,
  faCircleHalfStroke,
  faAngleLeft,
  faEllipsisVertical,
});

render(<App />, document.body);
