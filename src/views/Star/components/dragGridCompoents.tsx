import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);
const CPhomepage_title = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  lineHeight: '40px',
  padding: '0 20px',
  color: '#686868',
};
const CPhomepage_num = {
  lineHeight: '190px',
  fontSize: '50px',
  color: '#1F1F1F',
  textAlign: 'center',
};

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
          { i: 'g', x: 0, y: 0, w: 6, h: 10 },
          { i: 'a', x: 0, y: 0, w: 6, h: 10 },
          { i: 'b', x: 6, y: 0, w: 6, h: 10 },
          { i: 'c', x: 0, y: 10, w: 3, h: 10 },
          { i: 'd', x: 3, y: 10, w: 3, h: 10 },
          { i: 'e', x: 6, y: 10, w: 3, h: 10 },
          { i: 'f', x: 9, y: 10, w: 3, h: 10 },
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
        <div className='dashboardContent'>
          <ResponsiveGridLayout
            className='layout'
            layouts={{ lg: EUlayout }}
            rowHeight={30}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            isResizable={false}
            onLayoutChange={this.onLayoutChange}
            margin={[8, 8]}
          >
            <div className='dragcontent' key='g'>
              <div id='dragcontent_a'>设备分布</div>
            </div>
            <div className='dragcontent' key='a'>
              <div id='dragcontent_a'>最新事件列表</div>
            </div>
            <div className='dragcontent' key='b'>
              <div id='dragcontent_a'>事件统计(最近七天)</div>
            </div>
            <div className='dragcontent' key='c'>
              <div id='dragcontent_a'>可用性指标</div>
            </div>
            <div className='dragcontent' key='d'>
              <div id='dragcontent_a'>环境指标</div>
            </div>
            <div className='dragcontent' key='e'>
              <div id='dragcontent_a'>可靠性指标</div>
            </div>
            <div className='dragcontent' key='f'>
              <div id='dragcontent_a'>负荷指标</div>
            </div>
          </ResponsiveGridLayout>
        </div>
      </>
    );
  }
}
