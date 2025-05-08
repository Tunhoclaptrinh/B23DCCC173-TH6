// import React, { useState } from 'react';
import { Layout, Select, Slider, Space } from 'antd';
import { useModel } from 'umi';
import './style.less'; 
import { DestinationType } from '@/services/DuLich/constant';
import ListItem from './ListItem';

const { Header, Content } = Layout;
const { Option } = Select;

const HomePage: React.FC = () => {
    const {  setPriceRange, priceRange, setSortOrder, setCategoryFilter } = useModel('dulich.diemden');

  return (
    <Layout className="home-layout">
      <Header className="home-header">Du lịch Việt Nam</Header>
      <div className="hero-banner">
        <img src={require('@/assets/banner2.png')} alt="Banner" />
      </div>

      <Content className="home-content">
        <h2 className="section-title">Điểm đến nổi bật</h2>

        <Space className="filter-bar" wrap>
          <Select
            placeholder="Loại hình"
            allowClear
            onChange={value => setCategoryFilter(value)}
            style={{ width: 150 }}
          >
          {Object.entries(DestinationType).map(([key, value]) => (
              <Option key={key} value={value}>
                {value}
              </Option>
          ))}

          </Select>

          <span>Giá:</span>
          <Slider
            range
            min={500000}
            max={2000000}
            step={100000}
            defaultValue={priceRange}
            style={{ width: 200 }}
            onChange={val => setPriceRange(val as [number, number])}
          />

          <Select
            placeholder="Sắp xếp"
            onChange={value => setSortOrder(value)}
            style={{ width: 180 }}
            defaultValue="none"
          >
            <Option value="none">Không sắp xếp</Option>
            <Option value="priceAsc">Giá tăng dần</Option>
            <Option value="priceDesc">Giá giảm dần</Option>
            <Option value="ratingDesc">Đánh giá cao nhất</Option>
          </Select>
        </Space>
        <ListItem />
      </Content>

    </Layout>
  );
};

export default HomePage;
