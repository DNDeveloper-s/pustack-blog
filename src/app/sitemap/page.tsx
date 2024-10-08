import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface SitemapWithNoChildren {
  id: string;
  name: string;
  url: string;
}

interface ISitemap {
  id: string;
  name: string;
  url: string;
  serial_order: number;
  children: SitemapWithNoChildren[];
}

export const revalidate = 0;

const ordering = [
  "artificial-intelligence",
  "technology",
  "silicon-valley",
  "product-management",
  "others",
];

// Create function which will take string like product-management and return like Product Management
function capitalizeFirstLetter(string: string) {
  // Remove the hyphen and replace it with space
  const strings = string.split("-");

  // Capitalize the first letter of each word
  return strings
    .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
    .join(" ");
}

export default async function Sitemap() {
  const hierarchyRef = doc(db, "sitemap", "articles");
  const snapshot = await getDoc(hierarchyRef);
  const data = (snapshot.data()?.hierarchy ?? []) as ISitemap[];

  return (
    <div className="sitemap">
      <div className="sitemap__inner fadeIn">
        <h1>Sitemap</h1>
        <div className="classes__wrapper fadeIn">
          <div className="classes__section">
            <div className="sitemap__subjects">
              {data
                ?.sort((a, b) => a.serial_order - b.serial_order)
                ?.map(({ id, children, name, url }) => (
                  <div key={id} className="subject_wrapper">
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                      <h6 className="capitalize text-black">
                        {capitalizeFirstLetter(name)}
                      </h6>
                    </Link>
                    <div className="chapters_name mt-3">
                      {children.map((item) => (
                        <Link
                          className="sitemap-link opacity-70 text-blue-600 capitalize"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item?.id}
                        >
                          {item?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
