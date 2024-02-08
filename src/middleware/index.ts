

import { sequence } from "astro/middleware";
import { minifyHtml } from "./minifyHtml";
import { siteData } from "./siteData";

export const onRequest = sequence(siteData, minifyHtml);