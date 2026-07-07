type SeoInput = {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
};

export const seo = ({ title, description, image, keywords }: SeoInput) => [
  { title },
  { name: "description", content: description },
  { name: "keywords", content: keywords },
  { name: "og:title", content: title },
  { name: "og:description", content: description },
  { name: "og:type", content: "website" },
  { name: "twitter:title", content: title },
  { name: "twitter:description", content: description },
  ...(image
    ? [
        { name: "og:image", content: image },
        { name: "twitter:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
      ]
    : []),
];
