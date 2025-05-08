import React, { useState } from 'react';
import { Layout, Row, Col, Card, Rate, Select, Slider, Space } from 'antd';
import { useModel } from 'umi';
import './style.less'; 
import { DestinationType } from '@/services/DuLich/constant';
import ListItem from './ListItem';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Option } = Select;

const HomePage: React.FC = () => {
    const { filteredDestinations, setPriceRange, priceRange, setSortOrder, setCategoryFilter } = useModel('dulich.diemden');

  return (
    <Layout className="home-layout">
      <Header className="home-header">Du lịch Việt Nam</Header>
      <div className="hero-banner">
        <img src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-f458-622f-85af-1fdf4f527757/raw?se=2025-05-08T05%3A15%3A11Z&sp=r&sv=2024-08-04&sr=b&scid=00000000-0000-0000-0000-000000000000&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-07T11%3A38%3A28Z&ske=2025-05-08T11%3A38%3A28Z&sks=b&skv=2024-08-04&sig=pCwOGTQbrtunL7fqHJrLMPld5PspELOoyjckK75jbXo%3D" alt="Banner" />
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

        {/* <Row gutter={[16, 16]}> */}
          {/* {filteredDestinations.map(dest => (
            <Col key={dest.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={dest.name} src={dest.image_url} />}
              >
                <Meta title={dest.name} description={`Giá: ${dest.avg_accommodation_cost.toLocaleString()}₫`} />
                <Rate disabled defaultValue={dest.avg_rating} allowHalf style={{ marginTop: 8 }} />
              </Card>
            </Col>
          ))}  */}
        <ListItem />

        {/* </Row> */}
      </Content>

    </Layout>
  );
};

export default HomePage;
