export type ControlType = "text" | "boolean" | "number" | "select";
export type ControlValue = string | number | boolean;
export interface PropControl {
  name: string;
  label: string;
  type: ControlType;
  defaultValue: ControlValue;
  options?: readonly string[];
}
export interface CatalogEntry {
  id: string;
  name: string;
  category: string;
  tagName: string;
  description: string;
  controls: readonly PropControl[];
  slotContent?: string;
  slotHtml?: string;
}

const text = (name: string, label: string, defaultValue = ""): PropControl => ({
  name,
  label,
  type: "text",
  defaultValue,
});
const bool = (
  name: string,
  label: string,
  defaultValue = false,
): PropControl => ({
  name,
  label,
  type: "boolean",
  defaultValue,
});
const num = (
  name: string,
  label: string,
  defaultValue: number,
): PropControl => ({
  name,
  label,
  type: "number",
  defaultValue,
});
const select = (
  name: string,
  label: string,
  defaultValue: string,
  options: readonly string[],
): PropControl => ({ name, label, type: "select", defaultValue, options });

export const catalog: readonly CatalogEntry[] = [
  {
    id: "button",
    name: "Button",
    category: "Actions",
    tagName: "strata-button",
    description: "A clear action with semantic variants and states.",
    controls: [
      text("label", "Label", "Continue"),
      select("variant", "Variant", "outlined", [
        "filled",
        "outlined",
        "text",
        "elevated",
        "tonal",
      ]),
      select("size", "Size", "medium", ["small", "medium", "large"]),
      select("color", "Color", "primary", [
        "primary",
        "secondary",
        "error",
        "success",
        "warning",
      ]),
      bool("disabled", "Disabled"),
      bool("loading", "Loading"),
      bool("fullWidth", "Full width"),
    ],
  },
  {
    id: "icon-button",
    name: "IconButton",
    category: "Actions",
    tagName: "strata-icon-button",
    description: "A compact action identified by a Carbon icon.",
    controls: [
      select("size", "Size", "medium", ["small", "medium", "large"]),
      text("label", "Label", "Add item"),
      text("icon", "Icon", "carbon:add"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "button-group",
    name: "ButtonGroup",
    category: "Actions",
    tagName: "strata-button-group",
    description: "Groups related actions with a shared orientation.",
    controls: [
      select("orientation", "Orientation", "horizontal", [
        "horizontal",
        "vertical",
      ]),
    ],
    slotHtml:
      '<strata-button variant="outlined" label="One"></strata-button>' +
      '<strata-button variant="outlined" label="Two"></strata-button>' +
      '<strata-button variant="outlined" label="Three"></strata-button>',
  },
  {
    id: "stepper",
    name: "Stepper",
    category: "Actions",
    tagName: "strata-stepper",
    description: "Increments or decrements a bounded numeric value.",
    controls: [
      num("value", "Value", 3),
      num("min", "Min", 0),
      num("max", "Max", 10),
      bool("disabled", "Disabled"),
    ],
  },

  {
    id: "text-field",
    name: "TextField",
    category: "Forms",
    tagName: "strata-text-field",
    description: "A labelled single-line text input.",
    controls: [
      text("label", "Label", "Display name"),
      text("placeholder", "Placeholder", "Enter a value"),
      text("value", "Value"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "search-field",
    name: "SearchField",
    category: "Forms",
    tagName: "strata-search-field",
    description: "A text input specialised for search queries.",
    controls: [
      text("label", "Label", "Search"),
      text("placeholder", "Placeholder", "Search components"),
      text("value", "Value"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "number-field",
    name: "NumberField",
    category: "Forms",
    tagName: "strata-number-field",
    description: "A numeric input with step control.",
    controls: [
      text("label", "Label", "Quantity"),
      num("value", "Value", 1),
      num("step", "Step", 1),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "date-field",
    name: "DateField",
    category: "Forms",
    tagName: "strata-date-field",
    description: "A labelled date input.",
    controls: [
      text("label", "Label", "Date"),
      text("value", "Value", "2026-11-21"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "select",
    name: "Select",
    category: "Forms",
    tagName: "strata-select",
    description: "A labelled select control for option lists.",
    controls: [
      text("label", "Label", "Choose an option"),
      text("value", "Value"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "checkbox",
    name: "Checkbox",
    category: "Forms",
    tagName: "strata-checkbox",
    description: "A binary choice with an accessible label.",
    controls: [
      text("label", "Label", "Accept terms"),
      bool("checked", "Checked"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "radio",
    name: "Radio",
    category: "Forms",
    tagName: "strata-radio",
    description: "A single option inside a radio group.",
    controls: [
      text("label", "Label", "Option A"),
      text("name", "Name", "demo"),
      text("value", "Value", "a"),
      bool("checked", "Checked"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "radio-group",
    name: "RadioGroup",
    category: "Forms",
    tagName: "strata-radio-group",
    description: "Groups related radio options under one label.",
    controls: [text("label", "Label", "Plan")],
    slotHtml:
      '<strata-radio name="plan" label="Starter" value="starter" checked></strata-radio>' +
      '<strata-radio name="plan" label="Pro" value="pro"></strata-radio>' +
      '<strata-radio name="plan" label="Enterprise" value="enterprise"></strata-radio>',
  },
  {
    id: "switch",
    name: "Switch",
    category: "Forms",
    tagName: "strata-switch",
    description: "A toggle for an immediate on/off setting.",
    controls: [
      text("label", "Label", "Enable alerts"),
      bool("checked", "Checked"),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "slider",
    name: "Slider",
    category: "Forms",
    tagName: "strata-slider",
    description: "A continuous value selector within a range.",
    controls: [
      num("value", "Value", 50),
      num("min", "Min", 0),
      num("max", "Max", 100),
      num("step", "Step", 1),
      bool("disabled", "Disabled"),
    ],
  },
  {
    id: "file-upload",
    name: "FileUpload",
    category: "Forms",
    tagName: "strata-file-upload",
    description: "A drop target for one or more files.",
    controls: [
      text("accept", "Accept", "image/*"),
      bool("multiple", "Multiple"),
    ],
  },

  {
    id: "nav-item",
    name: "NavItem",
    category: "Navigation",
    tagName: "strata-nav-item",
    description: "A labelled navigation entry with selected state.",
    controls: [text("label", "Label", "Home"), bool("selected", "Selected")],
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    tagName: "strata-tabs",
    description: "Organises content into switchable panels.",
    controls: [num("activeTab", "Active tab", 0), bool("disabled", "Disabled")],
    slotHtml:
      '<strata-tab slot="tabs" panel-id="p1">Overview</strata-tab>' +
      '<strata-tab slot="tabs" panel-id="p2">Details</strata-tab>' +
      '<strata-tab slot="tabs" panel-id="p3">History</strata-tab>' +
      '<strata-tab-panel slot="panels" panel-id="p1">Overview panel content.</strata-tab-panel>' +
      '<strata-tab-panel slot="panels" panel-id="p2">Details panel content.</strata-tab-panel>' +
      '<strata-tab-panel slot="panels" panel-id="p3">History panel content.</strata-tab-panel>',
  },
  {
    id: "tab",
    name: "Tab",
    category: "Navigation",
    tagName: "strata-tab",
    description: "A single tab inside a tabs container.",
    controls: [
      text("panelId", "Panel id", "panel-1"),
      bool("active", "Active"),
      bool("disabled", "Disabled"),
    ],
    slotContent: "Tab label",
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "Navigation",
    tagName: "strata-breadcrumb",
    description: "Shows the path to the current location.",
    controls: [text("items", "Items", "Home|Products|Details")],
  },
  {
    id: "menu",
    name: "Menu",
    category: "Navigation",
    tagName: "strata-menu",
    description: "A container for a list of menu items.",
    controls: [bool("open", "Open", true)],
    slotHtml:
      '<strata-menu-item label="Profile"></strata-menu-item>' +
      '<strata-menu-item label="Settings"></strata-menu-item>' +
      '<strata-menu-item label="Sign out"></strata-menu-item>',
  },
  {
    id: "menu-item",
    name: "MenuItem",
    category: "Navigation",
    tagName: "strata-menu-item",
    description: "A single actionable entry inside a menu.",
    controls: [
      text("label", "Label", "Settings"),
      text("icon", "Icon", "carbon:settings"),
      bool("disabled", "Disabled"),
    ],
  },

  {
    id: "alert",
    name: "Alert",
    category: "Feedback",
    tagName: "strata-alert",
    description: "A semantic message that communicates feedback and status.",
    controls: [
      select("tone", "Tone", "info", ["error", "warning", "success", "info"]),
    ],
    slotContent: "Changes saved successfully.",
  },
  {
    id: "badge",
    name: "Badge",
    category: "Feedback",
    tagName: "strata-badge",
    description: "A compact label for status and classification.",
    controls: [
      select("tone", "Tone", "blue", [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "violet",
      ]),
    ],
    slotContent: "In review",
  },
  {
    id: "tag",
    name: "Tag",
    category: "Feedback",
    tagName: "strata-tag",
    description: "A removable label for categorising content.",
    controls: [text("label", "Label", "Draft"), bool("removable", "Removable")],
  },
  {
    id: "progress",
    name: "Progress",
    category: "Feedback",
    tagName: "strata-progress",
    description: "Indeterminate-free progress along a 0–100 scale.",
    controls: [num("value", "Value", 65)],
  },
  {
    id: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    tagName: "strata-skeleton",
    description: "A placeholder shape shown while content loads.",
    controls: [text("width", "Width", "60%")],
  },
  {
    id: "spinner",
    name: "Spinner",
    category: "Feedback",
    tagName: "strata-spinner",
    description: "An indeterminate loading indicator.",
    controls: [text("label", "Label", "Loading")],
  },
  {
    id: "snackbar",
    name: "Snackbar",
    category: "Feedback",
    tagName: "strata-snackbar",
    description: "A transient confirmation message.",
    controls: [
      bool("open", "Open", true),
      text("message", "Message", "Item saved."),
    ],
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "Feedback",
    tagName: "strata-tooltip",
    description: "Reveals helper text when the trigger is hovered.",
    controls: [text("text", "Text", "Helpful hint")],
    slotContent: "Hover target",
  },

  {
    id: "surface",
    name: "Surface",
    category: "Surfaces / overlays",
    tagName: "strata-surface",
    description: "A foundational container at a physical scale step.",
    controls: [
      select("size", "Size", "medium", ["small", "medium", "large", "hero"]),
      bool("outlined", "Outlined"),
    ],
    slotContent: "Surface content",
  },
  {
    id: "card",
    name: "Card",
    category: "Surfaces / overlays",
    tagName: "strata-card",
    description: "A content container for editorial material.",
    controls: [
      text("title", "Title", "Card title"),
      text("excerpt", "Excerpt", "A short supporting excerpt."),
      select("density", "Density", "normal", ["normal", "compact", "minimal"]),
      bool("bordered", "Bordered"),
    ],
  },
  {
    id: "dialog",
    name: "Dialog",
    category: "Surfaces / overlays",
    tagName: "strata-dialog",
    description: "A modal surface for focused interactions.",
    controls: [
      bool("open", "Open", true),
      text("title", "Title", "Dialog title"),
    ],
    slotContent: "Dialog body content.",
  },
  {
    id: "modal",
    name: "Modal",
    category: "Surfaces / overlays",
    tagName: "strata-modal",
    description: "An overlay dialog with size, position and animation.",
    controls: [
      bool("open", "Open", true),
      text("title", "Title", "Modal title"),
      select("size", "Size", "medium", [
        "small",
        "medium",
        "large",
        "xlarge",
        "full",
      ]),
      select("variant", "Variant", "default", [
        "default",
        "minimal",
        "bordered",
        "outlined",
        "glass",
        "accent-top",
        "accent-left",
      ]),
    ],
    slotContent: "Modal body content.",
  },
  {
    id: "drawer",
    name: "Drawer",
    category: "Surfaces / overlays",
    tagName: "strata-drawer",
    description: "A side panel that slides in from the edge.",
    controls: [bool("open", "Open", true), text("title", "Title", "Drawer")],
    slotContent: "Drawer body content.",
  },
  {
    id: "bottom-sheet",
    name: "BottomSheet",
    category: "Surfaces / overlays",
    tagName: "strata-bottom-sheet",
    description: "A sheet anchored to the bottom edge.",
    controls: [bool("open", "Open", true), text("title", "Title", "Sheet")],
    slotContent: "Bottom sheet content.",
  },
  {
    id: "popover",
    name: "Popover",
    category: "Surfaces / overlays",
    tagName: "strata-popover",
    description: "A floating panel anchored to a trigger.",
    controls: [bool("open", "Open", true)],
    slotContent: "Popover content.",
  },
  {
    id: "overlay",
    name: "Overlay",
    category: "Surfaces / overlays",
    tagName: "strata-overlay",
    description: "Text and metadata layered over media.",
    controls: [
      text("title", "Title", "Overlay title"),
      select("position", "Position", "center", ["top", "center", "bottom"]),
      select("align", "Align", "center", ["start", "center", "end"]),
    ],
  },
  {
    id: "theme-toggle",
    name: "ThemeToggle",
    category: "Surfaces / overlays",
    tagName: "strata-theme-toggle",
    description: "Switches between light and dark themes.",
    controls: [],
  },

  {
    id: "data-table",
    name: "DataTable",
    category: "Data / content",
    tagName: "strata-data-table",
    description: "A semantic table for tabular data.",
    controls: [],
    slotHtml:
      "<thead><tr><th>Name</th><th>Status</th></tr></thead>" +
      "<tbody><tr><td>Alpha</td><td>Active</td></tr>" +
      "<tr><td>Beta</td><td>Paused</td></tr></tbody>",
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "Data / content",
    tagName: "strata-pagination",
    description: "Navigates between pages of content.",
    controls: [num("page", "Page", 1), num("pages", "Pages", 5)],
  },
  {
    id: "list",
    name: "List",
    category: "Data / content",
    tagName: "strata-list",
    description: "A vertical stack of list items.",
    controls: [bool("divided", "Divided")],
    slotHtml:
      '<strata-list-item title="First item" description="Supporting text."></strata-list-item>' +
      '<strata-list-item title="Second item" description="Supporting text."></strata-list-item>' +
      '<strata-list-item title="Third item" description="Supporting text."></strata-list-item>',
  },
  {
    id: "list-item",
    name: "ListItem",
    category: "Data / content",
    tagName: "strata-list-item",
    description: "A titled row inside a list.",
    controls: [
      text("title", "Title", "Item title"),
      text("description", "Description", "Supporting description."),
      text("href", "Href"),
    ],
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "Data / content",
    tagName: "strata-accordion",
    description: "Expands and collapses grouped content.",
    controls: [
      bool("multiple", "Multiple"),
      select("variant", "Variant", "default", [
        "default",
        "bordered",
        "separated",
      ]),
    ],
    slotHtml:
      '<strata-accordion-item open><span slot="header">Section one</span>Content for the first section.</strata-accordion-item>' +
      '<strata-accordion-item><span slot="header">Section two</span>Content for the second section.</strata-accordion-item>' +
      '<strata-accordion-item><span slot="header">Section three</span>Content for the third section.</strata-accordion-item>',
  },
  {
    id: "carousel",
    name: "Carousel",
    category: "Data / content",
    tagName: "strata-carousel",
    description: "Cycles through a set of slides.",
    controls: [
      num("desktop", "Desktop slides", 1),
      select("gap", "Gap", "medium", [
        "none",
        "small",
        "medium",
        "large",
        "xlarge",
      ]),
      bool("autoPlay", "Auto play"),
      bool("showDots", "Show dots"),
    ],
    slotHtml:
      "<strata-carousel-item>Slide one</strata-carousel-item>" +
      "<strata-carousel-item>Slide two</strata-carousel-item>" +
      "<strata-carousel-item>Slide three</strata-carousel-item>",
  },
  {
    id: "grille",
    name: "Grille",
    category: "Data / content",
    tagName: "strata-grille",
    description: "A responsive grid for content tiles.",
    controls: [
      num("desktop", "Desktop columns", 2),
      select("gap", "Gap", "medium", ["small", "medium", "large"]),
    ],
    slotHtml:
      "<strata-grille-item>Tile one</strata-grille-item>" +
      "<strata-grille-item>Tile two</strata-grille-item>" +
      "<strata-grille-item>Tile three</strata-grille-item>" +
      "<strata-grille-item>Tile four</strata-grille-item>",
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Data / content",
    tagName: "strata-avatar",
    description: "Represents a user with initials or an image.",
    controls: [
      text("label", "Label", "AB"),
      text("alt", "Alt", "User avatar"),
      text("src", "Src"),
    ],
  },
  {
    id: "divider",
    name: "Divider",
    category: "Data / content",
    tagName: "strata-divider",
    description: "A horizontal rule separating content.",
    controls: [
      select("variant", "Variant", "solid", ["solid", "double", "dashed"]),
    ],
  },
  {
    id: "logo",
    name: "Logo",
    category: "Data / content",
    tagName: "strata-logo",
    description: "The STRATA brand mark.",
    controls: [],
  },
];

export const categories = [...new Set(catalog.map((entry) => entry.category))];
export function defaultsFor(entry: CatalogEntry): Record<string, ControlValue> {
  return Object.fromEntries(
    entry.controls.map(({ name, defaultValue }) => [name, defaultValue]),
  );
}
