import { defineMiddleware } from "astro/middleware";
import { minify } from "html-minifier";

export const minifyHtml = defineMiddleware(async (_, next) => {
    const response = await next();
    const html = await response.text();

    // console.log(html);

    try {
        const minifiedHtml = minify(html, {
            caseSensitive: true,
            collapseInlineTagWhitespace: false,
            collapseWhitespace: true,
            continueOnParseError: false,
            decodeEntities: false,
            keepClosingSlash: false,
            minifyCSS: true,
            minifyJS: true,
            preserveLineBreaks: false,
            removeAttributeQuotes: false,
            removeEmptyAttributes: false,
            removeEmptyElements: false,
            removeOptionalTags: false,
            removeRedundantAttributes: false,
            removeScriptTypeAttributes: false,
            removeStyleLinkTypeAttributes: false,
         });
    
         // console.log(minifiedHtml);
      
         return new Response(minifiedHtml, {
            status: 200,
            headers: response.headers,
         });  
    }
    catch (err) {
        return next();
    }
});