import { mount } from "svelte";
import App from "./App.svelte";
import "@strata/tokens/styles.css";
import "@strata/components";
import "@strata/components/dist/strata-components.es.css";
import "./styles.css";

mount(App, { target: document.getElementById("app")! });
