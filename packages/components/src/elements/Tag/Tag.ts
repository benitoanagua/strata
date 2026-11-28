import { customElement } from "lit/decorators.js";
import { StrataBadge } from "../Badge/Badge.js";

/**
 * @deprecated Use <strata-badge> with hue, href, and removable instead.
 * Kept as a thin compatibility alias; all behavior lives in StrataBadge.
 */
@customElement("strata-tag")
export class StrataTag extends StrataBadge {}
