<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    exclude-result-prefixes="sitemap"
    >
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en-CA">
      <head>
        <title>XML Sitemap</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; color: #444; }
          #sitemap { max-width: 980px; margin: 0 auto; }
          #sitemap__table { width: 100%; border: solid 1px #ccc; border-collapse: collapse; }
          #sitemap__table tr td.loc { direction: ltr; }
          #sitemap__table tr th { text-align: left; }
          #sitemap__table tr td, #sitemap__table tr th { padding: 10px; }
          #sitemap__table tr:nth-child(odd) td { background-color: #eee; }
          a:hover { text-decoration: none; }
        </style>
      </head>
      <body>
        <div id="sitemap">
          <div id="sitemap__header">
            <h1>XML Sitemap</h1>
            <p>This XML Sitemap is present to aid search engines indexing this site.</p>
            <p><a href="https://www.sitemaps.org/">Learn more about XML sitemaps.</a></p>
          </div>
          <div id="sitemap__content">
            <p class="text">Number of URLs in this XML Sitemap: <xsl:value-of select="count( sitemap:urlset/sitemap:url )" />.</p>
            <table id="sitemap__table">
              <thead>
                <tr>
                  <th class="loc">URL</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td class="loc"><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
