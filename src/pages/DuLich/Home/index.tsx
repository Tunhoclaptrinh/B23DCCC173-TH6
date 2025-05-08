import React, { useState } from 'react';
import { Layout, Row, Col, Card, Rate, Select, Slider, Space } from 'antd';
import { useModel } from 'umi';
import './style.less'; 

const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Option } = Select;

const HomePage: React.FC = () => {
    const { filteredDestinations, setPriceRange, priceRange, setSortOrder, setCategoryFilter } = useModel('dulich.diemden');

  return (
    <Layout className="home-layout">
      <Header className="home-header">Du lịch Việt Nam</Header>

      <Content className="home-content">
        <h2 className="section-title">Điểm đến nổi bật</h2>

        <Space className="filter-bar" wrap>
          <Select
            placeholder="Loại hình"
            allowClear
            onChange={value => setCategoryFilter(value)}
            style={{ width: 150 }}
          >
            <Option value="biển">Biển</Option>
            <Option value="núi">Núi</Option>
            <Option value="thành phố">Thành phố</Option>
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

        <Row gutter={[16, 16]}>
          {filteredDestinations.map(dest => (
            <Col key={dest.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={dest.name} src={dest.image_url} />}
              >
                <Meta title={dest.name} description={`Giá: ${dest.avg_accommodation_cost.toLocaleString()}₫`} />
                <Rate disabled defaultValue={dest.avg_rating} allowHalf style={{ marginTop: 8 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      <Footer className="home-footer">© 2025 Du Lịch Việt Nam</Footer>
    </Layout>
  );
};

export default HomePage;
