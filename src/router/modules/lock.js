const Lock = () => import('@/views/lock/index.vue')

export default [
  {
    path: '/lock',
    name: 'lock',
    component: Lock,
    meta: {
      title: 'Screen has locked',
    },
  },
]
