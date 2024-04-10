const Layout = () => import('@/layout/index.vue')
const orderStatistics = () => import('@/views/order/orderStatistics.vue')

export default [
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: {
      title: 'Order Management',
    },
    icon: 'Operation',
    children: [
      {
        path: '/orderStatistics',
        name: 'orderStatistics',
        component: orderStatistics,
        meta: {
          title: 'Order Stats',
        },
      },
    ],
  },
]
