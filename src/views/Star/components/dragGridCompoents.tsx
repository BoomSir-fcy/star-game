import React, { Component } from 'react';
import styled from 'styled-components';
import { Box, Flex, BgCard, Card, Button, Text } from 'uikit';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Normal = styled(Flex)`
  cursor: pointer;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #ffffff;
  font-size: 40px;
  text-shadow: 1px 1px 5px #41b7ff, -1px -1px 5px #41b7ff;
  width: 158px;
  height: 158px;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  transition: all 0.5s;
`;

export default class DragCompoents extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      EUlayout: [
        { i: 'g', x: 0, y: 0, w: 6, h: 10 },
        { i: 'a', x: 0, y: 0, w: 6, h: 10 },
        { i: 'b', x: 6, y: 0, w: 6, h: 10 },
        { i: 'c', x: 0, y: 10, w: 3, h: 10 },
        { i: 'd', x: 3, y: 10, w: 3, h: 10 },
        { i: 'e', x: 6, y: 10, w: 3, h: 10 },
        { i: 'f', x: 9, y: 10, w: 3, h: 10 },
      ] as any[],
    };
  }

  UNSAFE_componentWillMount() {
    console.log(2323);
    this.getUserInfo();
  }

  componentWillUnmount() {
    // componentWillMount进行异步操作时且在callback中进行了setState操作时，需要在组件卸载时清除state
    this.setState = () => {};
  }

  getUserInfo = () => {
    const _EUlayoutArr = null;
    if (_EUlayoutArr === null || _EUlayoutArr === undefined) {
      console.log('--null----');
      this.setState({
        EUlayout: [
          { i: 'g', x: 0, y: 0, w: 1, h: 1 },
          { i: 'a', x: 0, y: 0, w: 2, h: 1 },
          { i: 'b', x: 6, y: 0, w: 1, h: 1 },
          { i: 'c', x: 0, y: 1, w: 1, h: 1 },
          { i: 'd', x: 3, y: 1, w: 1, h: 1 },
          { i: 'e', x: 6, y: 1, w: 1, h: 1 },
          { i: 'f', x: 9, y: 1, w: 1, h: 10 },
        ],
      });
    } else {
      console.log('youzhi----');
      this.setState({
        EUlayout: _EUlayoutArr,
      });
      // this.state.EUlayout = _EUlayoutArr
    }
  };

  // 存储拖拽移动的位置到缓存
  onLayoutChange = (layout: any) => {
    console.log(layout, '=----layout----');
    const EUlayoutArr: any = [];

    let index = -1;
    localStorage.removeItem('CPlayoutArr');
    layout.forEach(({ i, x, y, w, h }: any) => {
      index++;
      EUlayoutArr[index] = { i, x, y, w, h };
    });
    localStorage.setItem('EUlayoutArr', JSON.stringify(EUlayoutArr));
  };

  render() {
    const { EUlayout } = this.state;
    console.log(EUlayout);
    return (
      <>
        <div
          style={{
            width: 476,
            height: 476,
            borderBottom: '1px solid #FFFF',
            borderRight: '1px solid #FFFF',
          }}
        >
          <ResponsiveGridLayout
            className='layout'
            layouts={{ lg: EUlayout }}
            rowHeight={30}
            breakpoints={{ lg: 476, md: 476, sm: 476, xs: 476, xxs: 0 }}
            cols={{ lg: 3, md: 3, sm: 3, xs: 3, xxs: 3 }}
            isResizable={false}
            onLayoutChange={this.onLayoutChange}
            margin={[8, 8]}
          >
            <Normal key='g'>
              <div id='dragcontent_a'>设备分布</div>
            </Normal>
            <Normal key='a'>
              <div id='dragcontent_a'>最新事件列表</div>
            </Normal>
            <Normal key='b'>
              <div id='dragcontent_a'>事件统计(最近七天)</div>
            </Normal>
            <Normal key='c'>
              <div id='dragcontent_a'>可用性指标</div>
            </Normal>
            <Normal key='d'>
              <div id='dragcontent_a'>环境指标</div>
            </Normal>
            <Normal key='e'>
              <div id='dragcontent_a'>可靠性指标</div>
            </Normal>
            <Normal key='f'>
              <div id='dragcontent_a'>负荷指标</div>
            </Normal>
          </ResponsiveGridLayout>
        </div>
      </>
    );
  }
}
