import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/players", "/games"];

  return routes.map((route) => ({
    url: `https://showstats.dugout.dev${route}`,
    lastModified: new Date(),
  }));
}
