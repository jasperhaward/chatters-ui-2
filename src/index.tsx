import { render } from "preact";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faUsers,
  faSearch,
  faTimes,
  faPaperPlane,
  faTerminal,
  faCircleNotch,
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
  faTimes,
  faPaperPlane,
  faTerminal,
  faCircleNotch,
});

render(<App />, document.body);
