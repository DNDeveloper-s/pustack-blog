import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface SitemapWithNoChildren {
  id: string;
  name: string;
  url: string;
}

interface Sitemap {
  id: string;
  name: string;
  url: string;
  children: SitemapWithNoChildren[];
}

export const revalidate = 0;

export default async function Sitemap() {
  const hierarchyRef = doc(db, "sitemap", "articles");
  const snapshot = await getDoc(hierarchyRef);
  const data = (snapshot.data()?.hierarchy ?? []) as Sitemap[];

  return (
    <div className="sitemap">
      <div className="sitemap__inner fadeIn">
        <h1>Sitemap</h1>
        <div className="classes__wrapper fadeIn">
          <div className="classes__section">
            <h4 className="capitalize">Posts</h4>
            <div className="sitemap__subjects">
              {data?.map(({ id, children, name, url }) => (
                <div key={id} className="subject_wrapper">
                  <Link href={url} target="_blank" rel="noopener noreferrer">
                    <h6 className="capitalize">{name}</h6>
                  </Link>
                  <div className="chapters_name">
                    {children.map((item) => (
                      <Link
                        className="sitemap-link text-blue-600 capitalize"
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
