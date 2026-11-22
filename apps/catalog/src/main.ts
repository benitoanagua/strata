import { mount } from "svelte";
import App from "./App.svelte";
import "@strata/tokens/styles.css";
import "@strata/components";
import "@strata/components/styles.css";
import "@strata/prose/prose.css";
import "./styles.css";

mount(App, { target: document.getElementById("app")! });
