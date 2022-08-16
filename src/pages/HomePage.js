import React from "react";
import Layout from "../components/layout/Layout";
import PostList from "../components/posts/PostList";

const HomePage = () => {
    return (
        <Layout>
            <PostList />
        </Layout>
    );
};

export default HomePage;
