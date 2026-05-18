import type { MetadataRoute } from "next";

const SITE_URL = "https://www.vanityface.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
      images: [`${SITE_URL}/opengraph-image.jpg`],
    },
    {
      url: `${SITE_URL}/#sobre`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/#procedimentos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#resultados`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/#clinica`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/#contato`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
