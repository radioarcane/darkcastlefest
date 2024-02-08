import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import Critters from "astro-critters";
import netlify from "@astrojs/netlify";

const domain = "https://www.darkcastlefest.com";

const ignorePages = [`${domain}/404/`, `${domain}/404.html`];

const siteMap = sitemap({
   filter: (page) => {
      return ignorePages.includes(page) === false;
   },
});

// https://astro.build/config
export default defineConfig({
   site: domain,
   integrations: [Critters(), siteMap],
   output: "static",
   adapter: netlify(),
   outDir: "build",
   build: {
      assets: "_assets",
   },
});
