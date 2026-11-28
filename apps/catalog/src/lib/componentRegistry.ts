export type ControlType = "text" | "boolean" | "number" | "select" | "list";
export type ControlValue = string | number | boolean;
export type Maturity = "experimental" | "beta" | "stable";

export interface PropControl {
  name: string;
  label: string;
  type: ControlType;
  defaultValue: ControlValue;
  options?: readonly string[];
  /**
   * Extra props merged into this control's variant demos. Use when the
   * meaningful way to show an option requires a non-default sibling prop —
   * e.g. semantic colors are demoed as `filled` so their solid treatment
   * is visible instead of a faint outlined tint.
   */
  demoProps?: Record<string, ControlValue>;
}

export interface EventDoc {
  name: string;
  detail?: string;
  description: string;
}

export interface SlotDoc {
  name: string;
  description: string;
}

export interface CatalogEntry {
  id: string;
  name: string;
  category: Category;
  tagName: string;
  description: string;
  maturity: Maturity;
  controls: readonly PropControl[];
  slotContent?: string;
  slotHtml?: string;
  events?: readonly EventDoc[];
  slots?: readonly SlotDoc[];
  a11y?: string;
  notes?: string;
}

export const CATEGORIES = [
  "Actions",
  "Forms",
  "Navigation",
  "Feedback",
  "Surfaces",
  "Data & Content",
  "Editorial",
  "Article Navigation",
] as const;
export type Category = (typeof CATEGORIES)[number];

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
  demoProps?: Record<string, ControlValue>,
): PropControl => ({
  name,
  label,
  type: "boolean",
  defaultValue,
  demoProps,
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
  demoProps?: Record<string, ControlValue>,
): PropControl => ({
  name,
  label,
  type: "select",
  defaultValue,
  options,
  demoProps,
});
const list = (name: string, label: string, defaultValue = ""): PropControl => ({
  name,
  label,
  type: "list",
  defaultValue,
});

// Self-contained demo portrait (grayscale silhouette) so the Avatar photo
// variant never depends on an external image service.
const AVATAR_PHOTO =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2096%2096%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20fill%3D%22%23DBDBDB%22/%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2235%22%20r%3D%2217%22%20fill%3D%22%238F8F8F%22/%3E%3Cpath%20d%3D%22M14%2092c2-22%2016-32%2034-32s32%2010%2034%2032z%22%20fill%3D%22%238F8F8F%22/%3E%3C/svg%3E";

const VALUE_EVENTS: readonly EventDoc[] = [
  {
    name: "strata-input",
    detail: "{ value }",
    description: "Fired on every value change while interacting.",
  },
  {
    name: "strata-change",
    detail: "{ value }",
    description: "Fired when the value is committed.",
  },
];

export const catalog: readonly CatalogEntry[] = [
  // ── Actions ────────────────────────────────────────────────────────────
  {
    id: "button",
    name: "Button",
    category: "Actions",
    tagName: "strata-button",
    description: "A clear action with semantic variants and states.",
    maturity: "stable",
    controls: [
      text("label", "Label", "Continue"),
      text("ariaLabel", "Aria label"),
      select("variant", "Variant", "outlined", [
        "filled",
        "outlined",
        "text",
        "elevated",
        "tonal",
      ]),
      select("size", "Size", "medium", ["small", "medium", "large"]),
      select(
        "color",
        "Color",
        "primary",
        ["primary", "error", "success", "warning"],
        // Semantic colors only read as solid actions when filled; the
        // outlined default would reduce them to a tinted label.
        { variant: "filled" },
      ),
      text("href", "Href"),
      select("type", "Type", "button", ["button", "submit", "reset"]),
      text("icon", "Icon", ""),
      // trailingIcon only repositions `icon`; the demo must provide one or
      // the state card renders a button with no icon at all.
      bool("trailingIcon", "Trailing icon", false, {
        icon: "carbon:arrow-right",
      }),
      bool("disabled", "Disabled"),
      bool("loading", "Loading"),
      bool("fullWidth", "Full width"),
    ],
    a11y: "Renders a native <button> (type=button by default, so it never submits a form accidentally) or an <a role=button> when href is set. The visible label names the control; set aria-label for icon-only usage — for dedicated icon buttons see strata-icon-button.",
  },
  {
    id: "icon-button",
    name: "IconButton",
    category: "Actions",
    tagName: "strata-icon-button",
    description: "A compact action identified by a Carbon icon.",
    maturity: "stable",
    controls: [
      select("size", "Size", "medium", ["small", "medium", "large"]),
      text("label", "Label", "Add item"),
      text("icon", "Icon", "carbon:add"),
      bool("disabled", "Disabled"),
    ],
    a11y: "Icon is decorative; the button is named by label via aria-label.",
  },
  {
    id: "stepper",
    name: "Stepper",
    category: "Actions",
    tagName: "strata-stepper",
    description: "Increments or decrements a bounded numeric value.",
    maturity: "beta",
    controls: [
      num("value", "Value", 3),
      num("min", "Min", 0),
      num("max", "Max", 10),
      bool("disabled", "Disabled"),
    ],
    a11y: "Minus/plus buttons carry aria-labels; the value uses tabular mono numerals.",
  },

  // ── Forms ──────────────────────────────────────────────────────────────
  {
    id: "text-field",
    name: "TextField",
    category: "Forms",
    tagName: "strata-text-field",
    description: "A labelled single-line text input with error state.",
    maturity: "stable",
    controls: [
      text("label", "Label", "Display name"),
      text("placeholder", "Placeholder", "Enter a value"),
      text("value", "Value"),
      bool("disabled", "Disabled"),
      bool("error", "Error"),
      text("errorMessage", "Error message", "This field is required."),
    ],
    events: VALUE_EVENTS,
    a11y: "Label is associated via for/id; errors use aria-invalid, aria-describedby and role=alert.",
  },
  {
    id: "search-field",
    name: "SearchField",
    category: "Forms",
    tagName: "strata-search-field",
    description: "A text input specialised for search queries.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Search"),
      text("placeholder", "Placeholder", "Search components"),
      text("value", "Value"),
      bool("disabled", "Disabled"),
    ],
    events: VALUE_EVENTS,
    a11y: "Wrapping label names the input; decorative search icon is aria-hidden.",
  },
  {
    id: "number-field",
    name: "NumberField",
    category: "Forms",
    tagName: "strata-number-field",
    description: "A numeric input with step control.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Quantity"),
      num("value", "Value", 1),
      num("min", "Min", 0),
      num("max", "Max", 100),
      num("step", "Step", 1),
      bool("disabled", "Disabled"),
    ],
    events: VALUE_EVENTS,
  },
  {
    id: "date-field",
    name: "DateField",
    category: "Forms",
    tagName: "strata-date-field",
    description: "A labelled native date input.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Date"),
      text("value", "Value", "2026-11-21"),
      bool("disabled", "Disabled"),
    ],
    events: VALUE_EVENTS,
  },
  {
    id: "select",
    name: "Select",
    category: "Forms",
    tagName: "strata-select",
    description:
      "A labelled select control; options come from the `options` property or slotted <option> elements.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Choose an option"),
      text("value", "Value"),
      list("options", "Options", "alpha|beta|gamma"),
      bool("disabled", "Disabled"),
    ],
    slotHtml:
      '<option value="a">Option A</option><option value="b">Option B</option><option value="c">Option C</option>',
    slots: [{ name: "default", description: "<option> elements." }],
    events: VALUE_EVENTS,
    notes:
      "`options` accepts an array of strings or { value, label, disabled } objects (JSON attribute or property); pipe/newline text works too. Slotted <option> children are mirrored when `options` is empty.",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    category: "Forms",
    tagName: "strata-checkbox",
    description: "A binary choice with an accessible label.",
    maturity: "stable",
    controls: [
      text("label", "Label", "Accept terms"),
      bool("checked", "Checked"),
      bool("disabled", "Disabled"),
    ],
    events: VALUE_EVENTS,
  },
  {
    id: "radio",
    name: "Radio",
    category: "Forms",
    tagName: "strata-radio",
    description: "A single option inside a radio group.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Option A"),
      text("name", "Name", "demo"),
      text("value", "Value", "a"),
      bool("checked", "Checked"),
      bool("disabled", "Disabled"),
    ],
    events: VALUE_EVENTS,
  },
  {
    id: "radio-group",
    name: "RadioGroup",
    category: "Forms",
    tagName: "strata-radio-group",
    description: "Groups related radio options under one fieldset legend.",
    maturity: "beta",
    controls: [text("label", "Label", "Plan")],
    slotHtml:
      '<strata-radio name="plan" label="Starter" value="starter" checked></strata-radio>' +
      '<strata-radio name="plan" label="Pro" value="pro"></strata-radio>' +
      '<strata-radio name="plan" label="Enterprise" value="enterprise"></strata-radio>',
    slots: [{ name: "default", description: "strata-radio children." }],
    a11y: "Uses a real <fieldset>/<legend> grouping.",
  },
  {
    id: "switch",
    name: "Switch",
    category: "Forms",
    tagName: "strata-switch",
    description: "A toggle for an immediate on/off setting.",
    maturity: "stable",
    controls: [
      text("label", "Label", "Enable alerts"),
      bool("checked", "Checked"),
      bool("disabled", "Disabled"),
    ],
    events: VALUE_EVENTS,
    a11y: "role=switch with aria-checked; Space/Enter toggles.",
  },
  {
    id: "slider",
    name: "Slider",
    category: "Forms",
    tagName: "strata-slider",
    description: "A continuous value selector within a range.",
    maturity: "beta",
    controls: [
      num("value", "Value", 50),
      num("min", "Min", 0),
      num("max", "Max", 100),
      num("step", "Step", 1),
      bool("disabled", "Disabled"),
    ],
    events: VALUE_EVENTS,
  },
  {
    id: "file-upload",
    name: "FileUpload",
    category: "Forms",
    tagName: "strata-file-upload",
    description:
      "A file picker with drag & drop; lists selected file names and emits strata-change.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Choose file"),
      text("accept", "Accept", "image/*"),
      bool("multiple", "Multiple"),
    ],
    events: [
      {
        name: "strata-change",
        detail: "{ value: string[] }",
        description: "Fired with the selected file names.",
      },
    ],
    a11y: "Native file input inside a label; selected names are listed for review.",
  },

  // ── Navigation ─────────────────────────────────────────────────────────
  {
    id: "nav",
    name: "Nav",
    category: "Navigation",
    tagName: "strata-nav",
    description:
      "Responsive primary navigation: desktop topbar, mobile hamburger navigation.",
    maturity: "beta",
    controls: [text("label", "Label", "Primary navigation"), text("menuLabel", "Mobile toggle label", "Open navigation")],
    slotHtml:
      '<strata-nav-item label="Home" href="/" selected></strata-nav-item>' +
      '<strata-nav-item label="Docs" href="/docs"></strata-nav-item>' +
      '<strata-nav-item label="Components" href="/components"></strata-nav-item>',
    slots: [{ name: "default", description: "strata-nav-item children." }],
    a11y: "Named nav landmark; mobile toggle exposes aria-expanded and links retain normal tab order.",
    notes: "Desktop renders a topbar; at mobile widths it collapses into an accessible hamburger panel. This is not the sidebar Menu component.",
  },
  {
    id: "nav-item",
    name: "NavItem",
    category: "Navigation",
    tagName: "strata-nav-item",
    description: "A labelled navigation entry with selected state.",
    maturity: "stable",
    controls: [text("label", "Label", "Home"), text("href", "Href", "/"), bool("selected", "Selected"), bool("disabled", "Disabled")],
    a11y: "Selection is exposed via aria-current=page, not color alone.",
    notes:
      "Group entries inside strata-nav for landmark semantics and arrow-key navigation; standalone use is supported.",
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    tagName: "strata-tabs",
    description: "Organises content into switchable panels with arrow-key nav.",
    maturity: "beta",
    controls: [num("activeTab", "Active tab", 0), bool("disabled", "Disabled")],
    slotHtml:
      '<strata-tab slot="tabs" panel-id="p1">Overview</strata-tab>' +
      '<strata-tab slot="tabs" panel-id="p2">Details</strata-tab>' +
      '<strata-tab slot="tabs" panel-id="p3">History</strata-tab>' +
      '<strata-tab-panel slot="panels" panel-id="p1">Overview panel content.</strata-tab-panel>' +
      '<strata-tab-panel slot="panels" panel-id="p2">Details panel content.</strata-tab-panel>' +
      '<strata-tab-panel slot="panels" panel-id="p3">History panel content.</strata-tab-panel>',
    slots: [
      { name: "tabs", description: "strata-tab children." },
      { name: "panels", description: "strata-tab-panel children." },
    ],
    events: [
      {
        name: "tab-change",
        detail: "{ activeTab, previousTab }",
        description: "Fired when the active tab changes.",
      },
    ],
    a11y: "role=tablist/tab/tabpanel with roving tabindex; arrows, Home and End move between tabs.",
  },
  {
    id: "tab",
    name: "Tab",
    category: "Navigation",
    tagName: "strata-tab",
    description: "A single tab inside a tabs container.",
    maturity: "beta",
    controls: [
      text("panelId", "Panel id", "panel-1"),
      bool("active", "Active"),
      bool("disabled", "Disabled"),
    ],
    slotContent: "Tab label",
    notes: "Managed by strata-tabs; standalone use is not supported.",
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "Navigation",
    tagName: "strata-breadcrumb",
    description:
      "Shows the path to the current location; supports links and marks the last item.",
    maturity: "beta",
    controls: [
      list(
        "items",
        "Items (JSON or pipe)",
        '[{"label":"Home","href":"/"},{"label":"Docs","href":"/docs"},{"label":"Components"}]',
      ),
      text("label", "Label", "Breadcrumb"),
    ],
    a11y: "nav landmark; last item carries aria-current=page.",
  },
  {
    id: "menu",
    name: "Menu",
    category: "Navigation",
    tagName: "strata-menu",
    description: "A vertical sidebar navigation list for contextual pages and sections.",
    maturity: "beta",
    controls: [bool("open", "Open", true), text("label", "Label", "Sidebar navigation")],
    slotHtml:
      '<strata-menu-item label="Profile" href="/profile"></strata-menu-item>' +
      '<strata-menu-item label="Settings" href="/settings" selected></strata-menu-item>' +
      '<strata-menu-item label="Sign out" icon="carbon:logout"></strata-menu-item>',
    slots: [{ name: "default", description: "strata-menu-item children." }],
    a11y: "Named navigation landmark with standard link/button tab order; not an ARIA command menu.",
    notes: "Use Menu for sidebar navigation. Use Nav/NavItem for the primary responsive topbar.",
  },
  {
    id: "menu-item",
    name: "MenuItem",
    category: "Navigation",
    tagName: "strata-menu-item",
    description: "A single actionable entry inside a menu.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Settings"),
      text("icon", "Icon", "carbon:settings"),
      text("href", "Href", "/settings"),
      bool("selected", "Selected"),
      bool("disabled", "Disabled"),
    ],
    notes: "Used inside strata-menu; emits no events of its own yet.",
  },

  // ── Feedback ───────────────────────────────────────────────────────────
  {
    id: "alert",
    name: "Alert",
    category: "Feedback",
    tagName: "strata-alert",
    description: "A semantic feedback message with inline and transient notification modes.",
    maturity: "stable",
    controls: [
      select("tone", "Tone", "info", ["error", "warning", "success", "info"]),
      select("mode", "Mode", "inline", ["inline", "snackbar"]),
      bool("open", "Open", true),
      text("message", "Message", "Changes saved successfully."),
      bool("closable", "Closable"),
      num("duration", "Duration (ms)", 3000),
      select("placement", "Placement", "bottom-center", ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"]),
    ],
    events: [{
      name: "strata-dismiss",
      detail: '{ reason: "manual" | "timeout" }',
      description: "Fired when dismissed by the close button or snackbar timer.",
    }],
    a11y: "Status tone is paired with an icon. Error messages announce assertively; the optional close button is accessible.",
    notes: "Inline mode stays in document flow. Snackbar mode is fixed-position and auto-dismisses after duration (default 3000 ms); set duration to 0 to disable the timer. closable is opt-in.",
  },
  {
    id: "badge",
    name: "Badge",
    category: "Feedback",
    tagName: "strata-badge",
    description: "A compact label for status or taxonomy, also used as an interactive filter chip, link, or removable item.",
    maturity: "stable",
    controls: [
      select("tone", "Tone", "neutral", [
        "neutral",
        "error",
        "warning",
        "success",
        "info",
      ]),
      select("hue", "Category hue", "neutral", [
        "neutral",
        "auto",
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "indigo",
        "violet",
      ]),
      text("label", "Label", "In review"),
      text("href", "Href"),
      bool("removable", "Removable"),
      bool("interactive", "Interactive"),
      bool("pressed", "Pressed"),
    ],
    events: [
      {
        name: "remove",
        description: "Fired when the remove button is clicked.",
      },
    ],
    a11y: "Status tones include a distinct icon alongside text; taxonomy hues always retain the text label. Use tone for state and hue for category.",
  },
  {
    id: "progress",
    name: "Progress",
    category: "Feedback",
    tagName: "strata-progress",
    description: "Determinate progress along a 0–100 scale.",
    maturity: "stable",
    controls: [num("value", "Value", 65), text("label", "Label", "Progress")],
    a11y: "role=progressbar with aria-valuemin/max/now and a label.",
  },
  {
    id: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    tagName: "strata-skeleton",
    description: "A placeholder shape shown while content loads.",
    maturity: "stable",
    controls: [text("width", "Width", "60%")],
    a11y: "aria-hidden; purely decorative loading affordance.",
  },
  {
    id: "spinner",
    name: "Spinner",
    category: "Feedback",
    tagName: "strata-spinner",
    description: "An indeterminate loading indicator.",
    maturity: "stable",
    controls: [text("label", "Label", "Loading")],
    a11y: "role=status with an accessible label.",
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "Feedback",
    tagName: "strata-tooltip",
    description: "Reveals helper text on hover or focus; Escape dismisses.",
    maturity: "beta",
    controls: [text("text", "Text", "Helpful hint")],
    slotContent: "Hover target",
    slots: [{ name: "default", description: "The trigger element." }],
    a11y: "role=tooltip shown on hover/focus-within; aria-hidden toggles with visibility. For full AT support prefer visible text or aria-describedby on the trigger.",
  },

  // ── Surfaces ───────────────────────────────────────────────────────────
  {
    id: "surface",
    name: "Surface",
    category: "Surfaces",
    tagName: "strata-surface",
    description: "A foundational container at a physical scale step.",
    maturity: "stable",
    controls: [
      select("size", "Size", "medium", ["small", "medium", "large", "hero"]),
      bool("outlined", "Outlined"),
    ],
    slotContent: "Surface content",
  },
  {
    id: "card",
    name: "Card",
    category: "Surfaces",
    tagName: "strata-card",
    description: "A content container for editorial material and media.",
    maturity: "beta",
    controls: [
      num("heading", "Heading level", 4),
      text("title", "Title", "Card title"),
      text("url", "Url", "/article"),
      text("excerpt", "Excerpt", "A short supporting excerpt."),
      select("density", "Density", "normal", ["normal", "compact", "minimal"]),
      select("media_align", "Media align", "top", [
        "top",
        "left",
        "right",
        "bottom",
      ]),
      bool("bordered", "Bordered"),
    ],
    a11y: "Title renders as a configurable heading level (h2–h6).",
  },
  {
    id: "modal",
    name: "Modal",
    category: "Surfaces",
    tagName: "strata-modal",
    description:
      "A modal overlay dialog that blocks page interaction, with size, position and animation.",
    maturity: "beta",
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
      select("position", "Position", "center", [
        "center",
        "top",
        "bottom",
        "left",
        "right",
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
      select("animation", "Animation", "slide-up", [
        "slide-up",
        "slide-down",
        "slide-left",
        "slide-right",
        "zoom",
        "flip",
        "fade",
      ]),
      bool("closeOnOverlay", "Close on overlay"),
      bool("closeOnEscape", "Close on escape"),
      bool("showClose", "Show close", true),
      bool("preventScroll", "Prevent scroll"),
    ],
    slotHtml:
      "<p>Modal body content.</p>" +
      ' <strata-button slot="actions" variant="filled" label="Action"></strata-button>',
    slots: [
      { name: "header", description: "Replaces the generated title header." },
      { name: "default", description: "Body content." },
      { name: "actions", description: "Footer actions." },
    ],
    events: [
      { name: "modal-open", description: "Fired after the modal opens." },
      {
        name: "modal-before-close",
        detail: "cancelable",
        description: "Fired before closing; preventDefault cancels.",
      },
      { name: "modal-close", description: "Fired after the modal closes." },
    ],
    a11y: "role=dialog aria-modal; scroll lock, focus trap and Escape handling; focus restored on close.",
    notes:
      "Modal is the blocking overlay variant of the dialog pattern — it owns the backdrop, scroll lock and transition choreography. ",
  },
  {
    id: "drawer",
    name: "Drawer",
    category: "Surfaces",
    tagName: "strata-drawer",
    description: "A side panel that slides in from the edge.",
    maturity: "beta",
    controls: [bool("open", "Open", true), text("title", "Title", "Drawer")],
    slotContent: "Drawer body content.",
    a11y: "role=dialog aria-modal; Escape closes, focus moves to the close button and is restored.",
  },
  {
    id: "bottom-sheet",
    name: "BottomSheet",
    category: "Surfaces",
    tagName: "strata-bottom-sheet",
    description: "A sheet anchored to the bottom edge.",
    maturity: "beta",
    controls: [bool("open", "Open", true), text("title", "Title", "Sheet")],
    slotContent: "Bottom sheet content.",
    a11y: "role=dialog aria-modal; Escape closes, focus moves to the close button and is restored.",
  },
  {
    id: "popover",
    name: "Popover",
    category: "Surfaces",
    tagName: "strata-popover",
    description:
      "A floating panel anchored to its trigger; opens by click or hover and closes on outside interaction.",
    maturity: "experimental",
    controls: [
      bool("open", "Open", true),
      text("label", "Label", "Popover"),
      select("trigger", "Trigger", "click", ["click", "hover"]),
      text("triggerLabel", "Trigger label", "Open popover"),
      bool("closeOnOutside", "Close on outside"),
    ],
    slotContent: "Popover content.",
    slots: [
      { name: "trigger", description: "Custom trigger element." },
      { name: "default", description: "Popover panel content." },
    ],
    a11y: "role=dialog with aria-label; Escape closes and refocuses the trigger. Positioning is anchored below the trigger; no collision flipping yet.",
    notes:
      'Set trigger="hover" for hover/focus opening; trigger="click" (default) toggles on click. Clicks inside the panel never close it.',
  },
  {
    id: "overlay",
    name: "Overlay",
    category: "Surfaces",
    tagName: "strata-overlay",
    description: "Text and metadata layered over a background image.",
    maturity: "beta",
    controls: [
      num("heading", "Heading level", 4),
      text("title", "Title", "Overlay title"),
      text("url", "Url", "/article"),
      text(
        "feature_image",
        "Feature image",
        "https://picsum.photos/seed/strata-overlay/1200/900",
      ),
      text("tag_name", "Tag", "Reportaje"),
      text("author_name", "Author", "Ana Ríos"),
      text("published_at", "Published", "12 Nov 2026"),
      text("reading_time", "Reading time", "4 min"),
      bool("show_meta", "Show meta"),
      select("aspect_ratio", "Aspect ratio", "monitor", [
        "square",
        "video",
        "monitor",
      ]),
      select("position", "Position", "center", ["top", "center", "bottom"]),
      select("align", "Align", "center", ["start", "center", "end"]),
      select("box", "Box", "background", [
        "border",
        "background",
        "transparent",
      ]),
      select("fill", "Fill", "full", ["full", "gradient", "none"]),
    ],
    a11y: "Title renders at a configurable heading level over the media.",
  },
  {
    id: "theme-toggle",
    name: "ThemeToggle",
    category: "Surfaces",
    tagName: "strata-theme-toggle",
    description: "Switches between light and dark themes.",
    maturity: "stable",
    controls: [],
    events: [
      {
        name: "theme-change",
        detail: "{ theme }",
        description: "Window event with the new theme (light|dark).",
      },
    ],
    a11y: "Button with an accessible label describing the action.",
  },

  // ── Data & Content ─────────────────────────────────────────────────────
  {
    id: "data-table",
    name: "DataTable",
    category: "Data & Content",
    tagName: "strata-data-table",
    description: "A semantic table for tabular data.",
    maturity: "beta",
    controls: [
      list("columns", "Columns", "Región|Zona|Artículos"),
      list(
        "rows",
        "Rows",
        "Altiplano|Oeste|42\nLitoral|Este|57\nChaco|Norte|33\nValles|Centro|21",
      ),
    ],
    a11y: 'Renders a native <table>; mark numeric columns with {"numeric":true} for mono/tabular figures.',
    notes:
      "Columns/rows accept JSON or pipe-delimited strings; there is no slotted markup API.",
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "Data & Content",
    tagName: "strata-pagination",
    description: "Navigates between pages of content (up to 7 buttons).",
    maturity: "beta",
    controls: [
      num("page", "Page", 1),
      num("pages", "Pages", 5),
      text("label", "Label", "Pagination"),
    ],
    events: [
      {
        name: "pagination-change",
        detail: "{ page, pages }",
        description: "Fired when a page button is activated.",
      },
    ],
    a11y: "nav landmark; current page carries aria-current=page.",
  },
  {
    id: "list",
    name: "List",
    category: "Data & Content",
    tagName: "strata-list",
    description: "A vertical stack of list items.",
    maturity: "stable",
    controls: [bool("divided", "Divided")],
    slotHtml:
      '<strata-list-item title="First item" description="Supporting text."></strata-list-item>' +
      '<strata-list-item title="Second item" description="Supporting text."></strata-list-item>' +
      '<strata-list-item title="Third item" description="Supporting text."></strata-list-item>',
    slots: [{ name: "default", description: "strata-list-item children." }],
  },
  {
    id: "list-item",
    name: "ListItem",
    category: "Data & Content",
    tagName: "strata-list-item",
    description: "A titled row inside a list.",
    maturity: "stable",
    controls: [
      text("title", "Title", "Item title"),
      text("description", "Description", "Supporting description."),
      text("href", "Href"),
    ],
    a11y: "Renders as article role=listitem inside strata-list.",
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "Data & Content",
    tagName: "strata-accordion",
    description: "Expands and collapses grouped content.",
    maturity: "beta",
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
    slots: [
      { name: "default", description: "strata-accordion-item children." },
    ],
    a11y: "Header buttons expose aria-expanded; Enter/Space toggles; single-open by default.",
  },
  {
    id: "carousel",
    name: "Carousel",
    category: "Data & Content",
    tagName: "strata-carousel",
    description: "Cycles through a set of slides with arrows, dots and swipe.",
    maturity: "beta",
    controls: [
      num("desktop", "Desktop slides", 1),
      num("mobile", "Mobile slides", 1),
      select("gap", "Gap", "medium", [
        "none",
        "small",
        "medium",
        "large",
        "xlarge",
      ]),
      num("interval", "Interval (ms)", 5000),
      bool("autoPlay", "Auto play"),
      bool("showArrows", "Show arrows", true),
      bool("showDots", "Show dots", true),
    ],
    slotHtml:
      '<strata-carousel-item><article style="padding:20px;border:1px solid var(--strata-color-border-subtle);min-height:150px"><small>01 / FEATURE</small><h3>Editorial story</h3><p>Lead content with a clear title and summary.</p></article></strata-carousel-item>' +
      '<strata-carousel-item><article style="padding:20px;border:1px solid var(--strata-color-border-subtle);min-height:150px"><small>02 / IMAGE</small><div style="height:70px;background:var(--strata-color-surface-selected);margin:12px 0"></div><h3>Visual feature</h3></article></strata-carousel-item>' +
      '<strata-carousel-item><article style="padding:20px;border:1px solid var(--strata-color-border-subtle);min-height:150px"><small>03 / BRIEF</small><h3>Short briefing</h3><p>Three distinct blocks make navigation visible.</p></article></strata-carousel-item>' +
      '<strata-carousel-item><article style="padding:20px;border:1px solid var(--strata-color-border-subtle);min-height:150px"><small>04 / NOTES</small><h3>Field notes</h3><p>A final slide to demonstrate the next control.</p></article></strata-carousel-item>',
    slots: [{ name: "default", description: "strata-carousel-item children." }],
    events: [
      { name: "carousel-change", description: "Fired when the slide changes." },
      {
        name: "carousel-navigation",
        description: "Fired on arrow/dDot navigation.",
      },
    ],
  },
  {
    id: "grille",
    name: "Grille",
    category: "Data & Content",
    tagName: "strata-grille",
    description: "A responsive grid for content tiles.",
    maturity: "beta",
    controls: [
      num("desktop", "Desktop columns", 2),
      num("mobile", "Mobile columns", 1),
      select("gap", "Gap", "medium", ["small", "medium", "large"]),
    ],
    slotHtml:
      '<strata-grille-item><div style="padding:16px"><small style="font:var(--strata-type-label-small) var(--strata-font-mono);color:var(--strata-color-text-secondary)">01</small><p style="margin:4px 0 0">Alpha tile</p></div></strata-grille-item>' +
      '<strata-grille-item><div style="padding:16px"><small style="font:var(--strata-type-label-small) var(--strata-font-mono);color:var(--strata-color-text-secondary)">02</small><p style="margin:4px 0 0">Beta tile</p></div></strata-grille-item>' +
      '<strata-grille-item><div style="padding:16px"><small style="font:var(--strata-type-label-small) var(--strata-font-mono);color:var(--strata-color-text-secondary)">03</small><p style="margin:4px 0 0">Gamma tile</p></div></strata-grille-item>' +
      '<strata-grille-item><div style="padding:16px"><small style="font:var(--strata-type-label-small) var(--strata-font-mono);color:var(--strata-color-text-secondary)">04</small><p style="margin:4px 0 0">Delta tile</p></div></strata-grille-item>',
    slots: [{ name: "default", description: "strata-grille-item children." }],
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Data & Content",
    tagName: "strata-avatar",
    description: "Represents a user with initials or an image.",
    maturity: "stable",
    controls: [
      select("variant", "Variant", "initials", ["initials", "photo"]),
      text("label", "Label", "Ada Lovelace"),
      text("alt", "Alt", "Portrait of Ada Lovelace"),
      text("src", "Photo URL", AVATAR_PHOTO),
    ],
    a11y: "role=img with aria-label, or presentation when unnamed.",
  },
  {
    id: "divider",
    name: "Divider",
    category: "Data & Content",
    tagName: "strata-divider",
    description: "A horizontal rule separating content.",
    maturity: "stable",
    controls: [
      select("variant", "Variant", "solid", ["solid", "double", "dashed"]),
    ],
  },
  {
    id: "logo",
    name: "Logo",
    category: "Data & Content",
    tagName: "strata-logo",
    description: "The STRATA brand mark.",
    maturity: "stable",
    controls: [],
  },
  {
    id: "prose",
    name: "Prose",
    category: "Data & Content",
    tagName: "strata-prose",
    description:
      "Reading wrapper for long-form content. Requires @strata/prose/prose.css.",
    maturity: "beta",
    controls: [],
    slotHtml: `<h1>On the architecture of quiet interfaces</h1>
<p class="hatnote">An editorial note on restraint, measure and the filete.</p>
<p>Typography is the voice of an interface. When a page is meant to be read rather than operated, the first decision is not which components to use but how much noise to remove. STRATA answers that question the way a well-set page of LaTeX does: a single serif voice for the text, a modest scale for headings, hairline rules instead of shadows, and a measure narrow enough that the eye never loses the line.</p>
<h2>Measure and rhythm</h2>
<p>A line of text should carry about sixty-five to seventy-five characters. Beyond that, the eye must travel too far to return; below that, the text breaks into choppy fragments. The prose layer enforces this with a <code>ch</code>-based measure, so the column breathes at any font size.</p>
<blockquote><p>Simplicity is not the absence of detail; it is the presence of only the detail that matters.</p></blockquote>
<p>Press <kbd>Ctrl</kbd>+<kbd>K</kbd> to search. A footnote marker looks like this.<sup class="footnote-ref"><a href="#fn1" id="fnref1">1</a></sup></p>
<div class="footnotes"><ol><li id="fn1">See <em>Design Laws</em>, §3, for the measure contract.</li></ol></div>`,
    notes:
      "Import '@strata/prose/prose.css' in the host page; the element only adds the .strata-prose class.",
  },

  // ── Editorial ──────────────────────────────────────────────────────────
  {
    id: "meta",
    name: "Meta",
    category: "Editorial",
    tagName: "strata-meta",
    description:
      "Metadata line (date, category, author) with slanted filete separators.",
    maturity: "beta",
    controls: [
      list(
        "items",
        "Items (JSON or pipe)",
        "21 nov 2026|Ciencia|Ana Ríos|4 min",
      ),
      text("label", "Label", "Article metadata"),
    ],
  },
  {
    id: "section-header",
    name: "SectionHeader",
    category: "Editorial",
    tagName: "strata-section-header",
    description:
      "Title with a hairline rule and an emphasised segment over the title.",
    maturity: "beta",
    controls: [
      text("heading", "Heading", "Autor"),
      text("subheading", "Subheading", "Ana Ríos"),
      num("level", "Heading level", 2),
    ],
    a11y: "Renders role=heading with aria-level matching the level prop.",
  },
  {
    id: "author-box",
    name: "AuthorBox",
    category: "Editorial",
    tagName: "strata-author-box",
    description:
      "Contributor card: avatar, name, role line, bio and links slot.",
    maturity: "beta",
    controls: [
      text("name", "Name", "Ana Ríos"),
      text("avatar", "Avatar label", "AR"),
      text("eyebrow", "Eyebrow", "Autora"),
      text("meta", "Meta", "Editora|Desde 2021|128 artículos"),
      text(
        "description",
        "Description",
        "Escribe sobre ciencia y cultura en los Andes.",
      ),
      text("href", "Href", "/autores/ana-rios"),
    ],
    slotHtml:
      '<strata-share slot="links" networks="x|linkedin|email" text="Ana Ríos" url="https://example.org"></strata-share>',
    slots: [{ name: "links", description: "Share links or profile actions." }],
  },
  {
    id: "share",
    name: "Share",
    category: "Editorial",
    tagName: "strata-share",
    description:
      "Share actions as monochrome glyphs: x, facebook, linkedin, whatsapp, telegram, email, copy.",
    maturity: "beta",
    controls: [
      list(
        "networks",
        "Networks",
        "x|facebook|linkedin|whatsapp|telegram|email|copy",
      ),
      text("url", "URL", "https://example.org/articulo"),
      text("text", "Text", ""),
      text("label", "Label", "Share"),
      select("direction", "Direction", "row", ["row", "col"]),
    ],
    a11y: "ul with per-network aria-labels; copy feedback via role=status.",
  },
  {
    id: "comment",
    name: "Comment",
    category: "Editorial",
    tagName: "strata-comment",
    description:
      "A comment or talk-page message with role badge, permalink, reply action and nested replies.",
    maturity: "beta",
    controls: [
      text("author", "Author", "Luis Mamani"),
      text("avatar", "Avatar", "LM"),
      text("date", "Date", "21 nov 2026"),
      text("dateTime", "Datetime", "2026-11-21"),
      text("role", "Role", "Moderador"),
      text("href", "Permalink", "#c1"),
      text("replyLabel", "Reply label", "Responder"),
      bool("replyable", "Replyable", true),
    ],
    slotHtml:
      "<p>Buen resumen. Falta citar la fuente del segundo párrafo.</p>" +
      '<strata-comment slot="replies" author="Ana Ríos" date="21 nov 2026" role-label="Autor"><p>Gracias, lo corrijo.</p></strata-comment>',
    slots: [
      { name: "default", description: "Comment body (prose HTML)." },
      { name: "replies", description: "Nested strata-comment children." },
    ],
    events: [
      {
        name: "strata-reply",
        description: "Fired when the reply action is activated.",
      },
    ],
  },
  {
    id: "comment-thread",
    name: "CommentThread",
    category: "Editorial",
    tagName: "strata-comment-thread",
    description: "Titled region holding comments, with a form slot.",
    maturity: "beta",
    controls: [
      text("heading", "Heading", "Discusión"),
      num("count", "Count", 2),
    ],
    slotHtml:
      '<strata-comment author="Luis Mamani" date="hoy"><p>Primer comentario.</p></strata-comment>' +
      '<strata-comment author="Ana Ríos" date="hoy"><p>Segundo comentario.</p></strata-comment>',
    slots: [
      { name: "default", description: "strata-comment children." },
      { name: "form", description: "Comment submission form." },
    ],
  },
  {
    id: "article-header",
    name: "ArticleHeader",
    category: "Editorial",
    tagName: "strata-article-header",
    description:
      "Kicker, headline, deck, byline meta, share slot and optional lead figure.",
    maturity: "beta",
    controls: [
      text("heading", "Heading", "El río que cambió de rumbo"),
      text(
        "deck",
        "Deck",
        "Una cronología de tres siglos de cartografía fluvial.",
      ),
      text("category", "Category", "Geografía"),
      text("author", "Author", "Ana Ríos"),
      text("date", "Date", "21 nov 2026"),
      text("meta", "Meta", ""),
      text("imageAlt", "Image alt", ""),
      text("caption", "Caption", ""),
    ],
    slotHtml:
      '<strata-share slot="share" networks="x|email|copy"></strata-share>',
    slots: [{ name: "share", description: "Share actions row." }],
    a11y: "Header landmark with h1 headline and metadata list.",
  },
  {
    id: "entry",
    name: "Entry",
    category: "Editorial",
    tagName: "strata-entry",
    description: "Listing row for articles, search results and recent changes; categories and tags render as Badge.",
    maturity: "beta",
    controls: [
      text("heading", "Heading", "Crónica de una cuenca"),
      text("href", "Href", "/articulo"),
      text(
        "excerpt",
        "Excerpt",
        "Cómo se organizó el agua en el valle durante el siglo XIX.",
      ),
      text("category", "Category", "Historia"),
      text("author", "Author", "Ana Ríos"),
      text("date", "Date", "20 nov 2026"),
      list("tags", "Tags", "Agua|Valles"),
      select("layout", "Layout", "stacked", ["stacked", "inline"]),
      bool("mediaEnd", "Media end"),
    ],
    a11y: "Article element with configurable heading level.",
  },
  {
    id: "quote",
    name: "Quote",
    category: "Editorial",
    tagName: "strata-quote",
    description:
      "Block quote with left filete, or pull quote framed by double rules.",
    maturity: "beta",
    controls: [
      select("variant", "Variant", "block", ["block", "pull"]),
      text("cite", "Cite", "Ana Ríos"),
      text("source", "Source url", ""),
    ],
    slotContent: "La cartografía es una forma de memoria compartida.",
    a11y: "figure > blockquote > figcaption > cite semantics.",
  },
  {
    id: "ticker",
    name: "Ticker",
    category: "Editorial",
    tagName: "strata-ticker",
    description:
      "Scroll-snapping strip of short headlines; optional auto-advance.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Últimas"),
      list(
        "items",
        "Items (JSON or pipe)",
        "Nueva página: Cuenca del Pilcomayo|Actualizada: Quebrada de Humahuaca|Revisión pendiente: Lago Titicaca",
      ),
      num("interval", "Interval (ms)", 0),
    ],
  },
  {
    id: "filter-bar",
    name: "FilterBar",
    category: "Editorial",
    tagName: "strata-filter-bar",
    description:
      "Badge-based category filters with view and sort toggles; emits strata-change.",
    maturity: "beta",
    controls: [
      list("items", "Items (JSON or pipe)", "Historia|Ciencia|Arte|Geografía"),
      text("value", "Value", ""),
      text("allLabel", "All label", "Todos"),
      select("view", "View", "list", ["list", "grid"]),
      select("sort", "Sort", "", ["", "asc", "desc"]),
      bool("hues", "Rainbow chips", true),
      bool("hideTools", "Hide tools"),
      text("label", "Label", "Filter"),
    ],
    events: [
      {
        name: "strata-change",
        detail: "{ value, view, sort }",
        description: "Fired when a chip or tool toggles.",
      },
    ],
    a11y: "Chips use aria-pressed; view/sort tools are toggle buttons.",
  },
  {
    id: "index-list",
    name: "IndexList",
    category: "Editorial",
    tagName: "strata-index-list",
    description:
      "Grouped index of links: site map, category index, alphabetical wiki index.",
    maturity: "beta",
    controls: [
      num("columns", "Columns", 2),
      list(
        "groups",
        "Groups (JSON)",
        '[{"heading":"A","items":[{"label":"Altiplano","href":"/a"},{"label":"Andes","href":"/b"}]},{"heading":"B","items":[{"label":"Bosque seco","href":"/c"}]}]',
      ),
    ],
  },
  {
    id: "ranked-list",
    name: "RankedList",
    category: "Editorial",
    tagName: "strata-ranked-list",
    description: "Numbered list with tabular numerals: most read, most edited.",
    maturity: "beta",
    controls: [
      list(
        "items",
        "Items (JSON or pipe)",
        "Salar de Uyuni|Lago Titicaca|Río Pilcomayo",
      ),
      select("variant", "Variant", "ordered", ["ordered", "none"]),
      bool("divider", "Divider", true),
      bool("striped", "Striped"),
      text("label", "Label", "Ranking"),
    ],
  },
  {
    id: "gallery",
    name: "Gallery",
    category: "Editorial",
    tagName: "strata-gallery",
    description:
      "Masonry columns of figures with a keyboard-friendly lightbox.",
    maturity: "beta",
    controls: [
      num("columns", "Columns", 3),
      bool("lightbox", "Lightbox", true),
      text("label", "Label", "Gallery"),
    ],
    slotHtml:
      '<figure><div style="height:120px;background:var(--strata-color-surface-selected)"></div><figcaption>Figura 1</figcaption></figure>' +
      '<figure><div style="height:180px;background:var(--strata-color-surface-hover)"></div><figcaption>Figura 2</figcaption></figure>' +
      '<figure><div style="height:90px;background:var(--strata-color-surface-selected)"></div><figcaption>Figura 3</figcaption></figure>',
    slots: [{ name: "default", description: "figure children." }],
    a11y: "Lightbox is a dialog with Close/Previous/Next buttons and Escape support.",
  },
  {
    id: "page-layout",
    name: "PageLayout",
    category: "Editorial",
    tagName: "strata-page-layout",
    description:
      "Start aside (TOC) · article · end aside (infobox); empty asides collapse.",
    maturity: "beta",
    controls: [bool("sticky", "Sticky asides", true)],
    slotHtml:
      '<strata-ranked-list slot="aside-start" label="Contenido" items="Introducción|Historia|Geografía" variant="none"></strata-ranked-list>' +
      "<strata-prose><p>Cuerpo del artículo con medida de lectura.</p></strata-prose>" +
      '<strata-badge slot="aside-end" label="Historia" hue="auto"></strata-badge> <strata-badge slot="aside-end" label="Geografía" hue="auto"></strata-badge>',
    slots: [
      { name: "aside-start", description: "Left rail (TOC, index)." },
      { name: "default", description: "Article body." },
      { name: "aside-end", description: "Right rail (infobox, tags)." },
    ],
  },

  // ── Article Navigation ─────────────────────────────────────────────────
  {
    id: "toc",
    name: "TableOfContents",
    category: "Article Navigation",
    tagName: "strata-toc",
    description:
      "Scroll-spy TOC built from a target's headings (or a manual list); list or rail variant, numbering, collapsible groups.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Contents"),
      text("heading", "Heading", "Contenidos"),
      text("target", "Target selector", ""),
      select("variant", "Variant", "list", ["list", "rail"]),
      bool("numbered", "Numbered", true),
      bool("collapsible", "Collapsible"),
      text("levels", "Levels", "2-3"),
      num("offset", "Scroll offset", 0),
      bool("sticky", "Sticky"),
      text("expandLabel", "Expand label", "Show subsections"),
      list(
        "items",
        "Manual items (JSON)",
        '[{"label":"Introducción","level":2},{"label":"Historia","level":2},{"label":"Orígenes","level":3}]',
      ),
    ],
    a11y: "nav landmark; current section marked with aria-current=location.",
  },
  {
    id: "reading-time",
    name: "ReadingTime",
    category: "Article Navigation",
    tagName: "strata-reading-time",
    description:
      "Estimated reading time from a target's words (skipping references) or a fixed count.",
    maturity: "beta",
    controls: [
      text("target", "Target selector", ""),
      num("words", "Words", 1450),
      num("wpm", "Words per minute", 220),
      text("label", "Label", "min de lectura"),
      text("wordsLabel", "Words label", "palabras"),
      bool("showWords", "Show words", true),
      text("exclude", "Exclude selector", ""),
    ],
  },
  {
    id: "reading-progress",
    name: "ReadingProgress",
    category: "Article Navigation",
    tagName: "strata-reading-progress",
    description:
      "Thin progress bar showing how far the reader is through the article.",
    maturity: "beta",
    controls: [
      text("target", "Target selector", ""),
      select("placement", "Placement", "inline", ["inline", "fixed"]),
      text("label", "Label", "Reading progress"),
    ],
    a11y: "role=progressbar with aria-valuenow updated on scroll.",
  },
  {
    id: "back-to-top",
    name: "BackToTop",
    category: "Article Navigation",
    tagName: "strata-back-to-top",
    description:
      "Returns to the top and moves focus there; floating after a scroll threshold, or inline.",
    maturity: "beta",
    controls: [
      select("variant", "Variant", "floating", ["floating", "inline"]),
      bool("showLabel", "Show label"),
      text("label", "Label", "Back to top"),
      num("threshold", "Threshold (px)", 400),
      text("target", "Focus target", ""),
    ],
    a11y: "After scrolling, focus moves to the target heading for keyboard users.",
  },
  {
    id: "cite",
    name: "Cite",
    category: "Article Navigation",
    tagName: "strata-cite",
    description:
      "Inline [n] citation marker, numbered by first appearance; pairs with References.",
    maturity: "beta",
    controls: [
      text("ref", "Reference id", "r1"),
      text("label", "Label override", ""),
      text("note", "Tooltip note", "Ríos, A. (2021). Cartografía andina."),
    ],
    notes:
      "Numbers are assigned globally by order of first appearance in the document.",
  },
  {
    id: "references",
    name: "References",
    category: "Article Navigation",
    tagName: "strata-references",
    description:
      "Numbered references in citation order, with lettered back-links to each citation.",
    maturity: "beta",
    controls: [
      text("heading", "Heading", "Referencias"),
      list(
        "items",
        "Items (JSON)",
        '[{"id":"r1","label":"Ríos, A. (2021). Cartografía andina. La Paz: Editorial Andes."},{"id":"r2","label":"Servicio Geográfico Militar. Atlas de Bolivia.","href":"https://example.org/atlas"}]',
      ),
    ],
    slots: [{ name: "default", description: "Fallback manual entries." }],
  },
  {
    id: "hatnote",
    name: "Hatnote",
    category: "Article Navigation",
    tagName: "strata-hatnote",
    description: "Disambiguation / see-also line above an article.",
    maturity: "beta",
    controls: [
      text("lead", "Lead", "Para otros usos, véase"),
      list(
        "items",
        "Items (JSON)",
        '[{"label":"Pilcomayo (desambiguación)","href":"/d"},{"label":"Río Paraguay","href":"/p"}]',
      ),
      text("separator", "Separator", "·"),
    ],
  },
  {
    id: "article-nav",
    name: "ArticleNav",
    category: "Article Navigation",
    tagName: "strata-article-nav",
    description: "Previous / next links at the end of an article or series.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Article navigation"),
      text("prev", "Previous", "Cuenca del Plata"),
      text("prevHref", "Previous URL", "/prev"),
      text("prevLabel", "Previous label", "Anterior"),
      text("next", "Next", "Río Bermejo"),
      text("nextHref", "Next URL", "/next"),
      text("nextLabel", "Next label", "Siguiente"),
    ],
    a11y: "nav landmark with rel=prev/next semantics.",
  },
  {
    id: "heading-anchors",
    name: "HeadingAnchors",
    category: "Article Navigation",
    tagName: "strata-heading-anchors",
    description:
      "Adds permalink anchors to a target's headings (renders nothing itself).",
    maturity: "beta",
    controls: [
      text("target", "Target selector", "article"),
      text("levels", "Levels", "2-4"),
      text("label", "Anchor label", "Link to this section"),
    ],
    notes:
      "This enhancer intentionally renders no standalone UI. In the preview, look for the # permalink next to each target heading; it appends anchors to the selected article rather than drawing a separate component.",
  },
  {
    id: "tree",
    name: "Tree",
    category: "Navigation",
    tagName: "strata-tree",
    description:
      "Accessible data-driven tree with selection, expansion and full keyboard navigation.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Tree"),
      list(
        "nodes",
        "Nodes (JSON)",
        '[{"id":"cat","label":"Category","meta":"2","children":[{"id":"one","label":"First item"},{"id":"two","label":"Second item","disabled":true}]},{"id":"solo","label":"Standalone node","icon":"carbon:document"}]',
      ),
      list("selectedIds", "Selected ids (JSON)", '["one"]'),
      select("expandMode", "Expand mode", "multiple", ["multiple", "single"]),
      bool("multiple", "Multiple selection"),
      text("emptyLabel", "Empty label", "No items"),
    ],
    events: [
      {
        name: "strata-select",
        detail: "{ id, node, selected }",
        description: "Fired when a node is activated.",
      },
      {
        name: "strata-selection-change",
        detail: "{ ids }",
        description: "Fired with the full set of selected ids.",
      },
      {
        name: "strata-toggle",
        detail: "{ id, expanded }",
        description: "Fired when a parent node expands or collapses.",
      },
    ],
    a11y: "role=tree/treeitem/group with aria-level, aria-setsize, aria-posinset, aria-expanded, aria-selected and aria-disabled; roving tabindex; ArrowUp/Down/Left/Right, Home, End, Enter and Space.",
    notes:
      "Data-driven only: pass nodes as a StrataTreeNode[] or JSON. Navigation is the consumer's job — listen to strata-select and route yourself.",
  },
  {
    id: "viewer-settings",
    name: "ViewerSettings",
    category: "Surfaces",
    tagName: "strata-viewer-settings",
    description:
      "Disclosure panel with theme, surface, viewport and motion preferences for viewers and playgrounds.",
    maturity: "beta",
    controls: [
      text("label", "Label", "Viewer settings"),
      select("theme", "Theme", "system", ["system", "light", "dark"]),
      select("surface", "Surface", "auto", ["auto", "light", "dark", "grid"]),
      select("viewport", "Viewport", "desktop", [
        "desktop",
        "tablet",
        "mobile",
      ]),
      select("motion", "Motion", "system", ["system", "reduced"]),
      bool("open", "Open"),
    ],
    events: [
      {
        name: "strata-change",
        detail: "{ value: { theme, surface, viewport, motion } }",
        description: "Fired when any setting changes.",
      },
    ],
    a11y: "Toggle button exposes aria-expanded/aria-controls; the panel is a labelled group of labelled selects; Escape closes and focus returns to the toggle.",
    notes:
      "Controlled component: persistence and theme resolution stay in the consumer. Used by this catalog itself (key: strata-catalog-viewer).",
  },
];

export const categories: readonly Category[] = CATEGORIES;

export function entryById(id: string): CatalogEntry | undefined {
  return catalog.find((entry) => entry.id === id);
}

export function entriesInCategory(category: Category): CatalogEntry[] {
  return catalog.filter((entry) => entry.category === category);
}

export function defaultsFor(
  controls: readonly PropControl[],
): Record<string, ControlValue> {
  return Object.fromEntries(
    controls.map(({ name, defaultValue }) => [name, defaultValue]),
  );
}
