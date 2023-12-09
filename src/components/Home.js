import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";

const { TabPane } = Tabs;

function Home(props) {
  const [posts, setPost] = useState([]);
  const [activeTab, setActiveTab] = useState("image");
  const [searchOption, setSearchOption] = useState({
    type: SEARCH_KEY.all,
    keyword: "",
  });

  const searchService = (option) => {
    const {type, keyword} = option;
    setSearchOption({type, keyword});  //名字一致的时候可以简化写，甚至可以更加简化直接写option,让它自己解构
  }

  useEffect(() => {
    const { type, keyword } = searchOption;
    fetchPost(searchOption);
  }, [searchOption]);

  const fetchPost = (option) => {
    const { type, keyword } = option;
    let url = "";

    if (type === SEARCH_KEY.all) {
      url = `${BASE_URL}/search`;
    } else if (type === SEARCH_KEY.user) {
      url = `${BASE_URL}/search?user=${keyword}`;
    } else {
      url = `${BASE_URL}/search?keywords=${keyword}`;
    }

    const opt = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    };

    axios(opt)
      .then((res) => {
        if (res.status === 200) {
          setPost(res.data);
        }
      })
      .catch((err) => {
        message.error("Fetch posts failed!");
        console.log("fetch posts failed: ", err.message);
      });
  };

  const renderPosts = (type) => {
    if (!posts || posts.length === 0) {
      return <div>No data!</div>;
    }
    if (type === "image") {
      const imageArr = posts
        .filter((item) => item.type === "image") 
        .map((image) => {
          return {
            postId: image.id,
            src: image.url,
            user: image.user,
            caption: image.message,
            thumbnail: image.url,
            thumbnailWidth: 300,
            thumbnailHeight: 200,
          };
        });
      return <PhotoGallery images={imageArr} />;
    } else if (type === "video") {
      return (
        <Row gutter={32}>
          {posts
            .filter((post) => post.type === "video")
            .map((post) => (
              <Col span={8} key={post.url}>
                <video src={post.url} controls={true} className="video-block" />
                <p>
                  {post.user}: {post.message}
                </p>
              </Col>
            ))}
        </Row>
      );
    } else if (type === "unknown"){
      const imageArr = posts
        .filter((item) => item.type === "unknown") 
        .map((image) => {
          return {
            src: image.url,
            user: image.user,
            caption: image.message,
            thumbnail: image.url,
            thumbnailWidth: 300,
            thumbnailHeight: 200,
          };
        });
      return <PhotoGallery images={imageArr} />;
    }
  };

  const showPost = (type) => {
    console.log("type -> ", type);
    setActiveTab(type);
    // 等待3000ms(3s)后，再更新search result
    setTimeout(() => {
      setSearchOption({ type: SEARCH_KEY.all, keyword: "" });
    }, 3000);
  };
  const operations = <CreatePostButton onShowPost={showPost} />;
  
  return (
    <div className="home">
      {/* 第一个handleSearch相当于是SearchBar自定义的attribute，叫啥名字都可以，第二个是我们自定义的function */}
      <SearchBar handleSearch={searchService}/> 
      <div className="display">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          defaultActiveKey="image"
          activeKey={activeTab}
          tabBarExtraContent={operations}
        >
          <TabPane tab="Images" key="image">
            {renderPosts("image")}
          </TabPane>
          <TabPane tab="Videos" key="video">
            {renderPosts("video")}
          </TabPane>
          <TabPane tab="Unknown" key="unknown">
            {renderPosts("unknown")}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Home;
