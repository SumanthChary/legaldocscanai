import * as React from "react";
import * as ReactDOMClient from "react-dom/client";

declare global {
  interface Window {
    React?: typeof React;
    ReactDOM?: typeof ReactDOMClient;
  }
}

if (typeof window !== "undefined") {
  if (!window.React) {
    window.React = React;
  }
  if (!window.ReactDOM) {
    window.ReactDOM = ReactDOMClient;
  }
}
