import type { Dictionary } from "./common";
import { common } from "./common";
import { nav } from "./nav";
import { landing } from "./landing";
import { pricing } from "./pricing";
import { auth } from "./auth";
import { inbox } from "./inbox";
import { settings } from "./settings";
import { analytics } from "./analytics";
import { channels } from "./channels";
import { checkout } from "./checkout";
import { misc } from "./misc";

export const dictionary: Dictionary = {
  ...common,
  ...nav,
  ...landing,
  ...pricing,
  ...auth,
  ...inbox,
  ...settings,
  ...analytics,
  ...channels,
  ...checkout,
  ...misc,
};

export type { Dictionary, Translations } from "./common";
