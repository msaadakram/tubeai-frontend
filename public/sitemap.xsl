<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html>
<head>
  <title>Sitemap</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 16px; color: #333; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
    th { background: #6366f1; color: #fff; text-align: left; padding: 12px 16px; font-size: 13px; text-transform: uppercase; letter-spacing: .5px; }
    td { padding: 10px 16px; border-bottom: 1px solid #eee; font-size: 13px; color: #555; }
    tr:hover td { background: #fafaff; }
    a { color: #6366f1; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .priority { font-weight: 600; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
    .badge-weekly { background: #dbeafe; color: #1d4ed8; }
    .badge-monthly { background: #f3e8ff; color: #7c3aed; }
    .badge-yearly { background: #fce7f3; color: #be185d; }
    .alts { font-size: 11px; color: #999; }
    .count { text-align: center; color: #888; padding: 20px; font-size: 14px; }
  </style>
</head>
<body>
  <h1>Sitemap</h1>
  <xsl:choose>
    <xsl:when test="sitemap:urlset">
      <p style="margin-bottom:12px;color:#666;font-size:14px;">
        <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
      </p>
      <table>
        <tr>
          <th>URL</th>
          <th>Last Modified</th>
          <th>Change Frequency</th>
          <th>Priority</th>
        </tr>
        <xsl:for-each select="sitemap:urlset/sitemap:url">
          <tr>
            <td><a href="{sitemap:loc}" target="_blank"><xsl:value-of select="sitemap:loc"/></a></td>
            <td><xsl:value-of select="sitemap:lastmod"/></td>
            <td>
              <span class="badge badge-{sitemap:changefreq}">
                <xsl:value-of select="sitemap:changefreq"/>
              </span>
            </td>
            <td class="priority"><xsl:value-of select="sitemap:priority"/></td>
          </tr>
        </xsl:for-each>
      </table>
      <p class="count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</p>
    </xsl:when>
    <xsl:when test="sitemap:sitemapindex">
      <table>
        <tr><th>Sitemap</th><th>Last Modified</th></tr>
        <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
          <tr>
            <td><a href="{sitemap:loc}" target="_blank"><xsl:value-of select="sitemap:loc"/></a></td>
            <td><xsl:value-of select="sitemap:lastmod"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </xsl:when>
  </xsl:choose>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
