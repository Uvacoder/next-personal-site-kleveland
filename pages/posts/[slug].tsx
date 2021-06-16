import React, { ReactElement } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import styles from "../../styles/blogpost.module.css";
import getPostList from "../api/post-list";
import getPost from "../api/post";
import { NotionRenderer, Code, CollectionRow } from "react-notion-x";
import { getPageTableOfContents, TableOfContentsEntry } from "notion-utils";
import pageList from "../../_posts/data.json";
import MainLayout from "../../layouts/main";

const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

export const getStaticProps = async (context: any) => {
  const mappedList = getPostList(pageList);
  console.log("mappedList", mappedList);
  const foundPost = mappedList.find(
    (entry: any) => entry["Slug"] === context.params["slug"]
  );
  if (!foundPost)
    return {
      props: {},
      revalidate: 10,
    };
  console.log(foundPost);
  const results = await getPost(foundPost.id);
  const foundImageBlock = Object.keys(results.recordMap.block).find(
    (key: string) => results.recordMap.block[key].value.type === "page"
  );
  const foundImageLink =
    foundImageBlock &&
    results.recordMap.block[foundImageBlock].value.format?.page_icon
      ? results.recordMap.block[foundImageBlock].value.format.page_icon
      : false;
  console.log(foundImageLink);
  //Correct
  //https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Ff72ffe9f-5a03-4b12-af62-68d4d5b05e69%2F3.png?table=block&id=ad8bab48-7d68-4f84-add0-ddaf3b65bbfd&cache=v2
  //Wrong
  //https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Ff72ffe9f-5a03-4b12-af62-68d4d5b05e69%2F3.png?table=block&${}&cache=v2
  const imageUrl =
    foundImageLink && foundImageBlock
      ? `https://www.notion.so/image/${encodeURIComponent(
          foundImageLink
        )}?table=block&id=${
          results.recordMap.block[foundImageBlock].value.id
        }&cache=v2`
      : "/post_images/empty_image.svg";
  console.log(imageUrl);
  const recordMap = results.recordMap;
  console.log(foundImageBlock);
  console.log("FOUND IMAGE BLOCK____________________________");
  console.log(
    foundImageBlock ? results.recordMap.block[foundImageBlock] : "null"
  );
  const tableOfContents = foundImageBlock
    ? getPageTableOfContents(
        results.recordMap.block[foundImageBlock].value,
        recordMap
      )
    : "";
  return {
    props: {
      recordMap,
      imageUrl,
      tableOfContents,
      ...foundPost,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  // if (isDev) {
  //   return {
  //     paths: [],
  //     fallback: true,
  //   };
  // }

  console.log("before foundPageas");
  const results = getPostList(pageList);
  const mappedSlugs = results.map((entry: any) => ({
    params: { slug: entry["Slug"] },
  }));
  console.log(mappedSlugs);
  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.

  return {
    paths: mappedSlugs,
    fallback: true,
  };
}

function NotionPage({
  recordMap,
  tableOfContents,
  title,
  Slug,
  imageUrl,
  Description,
}: {
  Slug: string;
  title: string;
  tableOfContents: any;
  Description: string;
  recordMap: any;
  imageUrl: string;
}) {
  if (!recordMap) {
    return null;
  }
  console.log("toc", tableOfContents);
  console.log(recordMap);
  console.log(title, imageUrl);

  return (
    <>
      <Head>
        <title>Kacey Cleveland - {title}</title>
        <meta name="description" content={Description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles["blog-post-title-container"]}>
        <div className={styles["blog-post-image-container"]}>
          <Image src={imageUrl} width={64} height={64} alt="Post image" />
        </div>
        <div className={styles["blog-post-title"] + " notion-h notion-h1"}>
          {title}
        </div>
      </div>
      <div className={styles["blog-post-container"]}>
        <NotionRenderer
          className={styles["blog-post-notion-container"]}
          components={{
            code: Code,
            collectionRow: CollectionRow,
          }}
          recordMap={recordMap}
          darkMode={false}
        />
        <TableOfContents toc={tableOfContents} />
      </div>
    </>
  );
}

interface TableOfContentsProps {
  toc: TableOfContentsEntry[];
}

function TableOfContents({ toc }: TableOfContentsProps): ReactElement {
  return (
    <aside className={"notion-aside " + styles["blog-notion-aside"]}>
      <div className={styles["blog-table-of-contents-title"]}>
        Table of Contents
      </div>
      <div className={styles["blog-table-of-contents"]}>
        {toc.map((entry) => {
          
          const className = "blog-table-of-contents__" + entry.type;
          const link = "#" + entry.id.replaceAll("-", "");
          console.log(className)
          return <Link href={link}><div className={styles['blog-table-of-contents__entry'] + ' ' + styles[className]}>
            <a href={link}>{entry.text}</a>
          </div></Link>;
        })}
      </div>
    </aside>
  );
}

NotionPage.Layout = MainLayout;

export default NotionPage;
