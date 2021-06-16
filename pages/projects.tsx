import MainLayout from './../layouts/main'
import { ReactElement } from 'react';
import getPost from "./api/post";
import { NotionRenderer } from "react-notion-x";

interface ProjectPageProps {
    recordMap: any;
}

export const getStaticProps = async (context: any) => {
    const results = await getPost("0561ad09-5dda-4692-8fa0-5a0baff7b14a");

    const recordMap = results.recordMap;
    return {
      props: {
        recordMap
      },
      revalidate: 10,
    };
};


function ProjectPage({ recordMap }: ProjectPageProps): ReactElement {
    console.log(recordMap);
    return <NotionRenderer
    recordMap={recordMap}
    darkMode={false}
  />
}

ProjectPage.Layout = MainLayout;

export default ProjectPage;