export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

// Add other types if found in asrulnurrahim later, for now basic placeholder to avoid compilation errors if something imports it.
