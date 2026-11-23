export type ButtonVariant =
  "filled" | "outlined" | "text" | "elevated" | "tonal";
export type ButtonSize = "small" | "medium" | "large";
/**
 * @deprecated `secondary` is kept for compatibility only. It expressed action
 * hierarchy through the color axis, duplicating the soft neutral surface that
 * `variant="tonal"` already provides. Use `color="primary"` with
 * `variant="tonal"` (or a semantic color + `tonal`) for soft emphasis, and
 * reserve `color` for semantic intent (`error`, `success`, `warning`).
 * Removal is planned for the next major version.
 */
export type DeprecatedButtonColor = "secondary";
export type ButtonColor =
  "primary" | DeprecatedButtonColor | "error" | "success" | "warning";
export type ButtonType = "button" | "submit" | "reset";
export type { StrataIconName } from "./iconify.js";

export interface ButtonProps {
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  color: ButtonColor;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  type?: ButtonType;
  icon?: `carbon:${string}`;
  trailingIcon?: boolean;
  fullWidth?: boolean;
}
