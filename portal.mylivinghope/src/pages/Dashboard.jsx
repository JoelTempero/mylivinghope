import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import { Card, Badge } from '../components/ui'
import {
  Package,
  CheckSquare,
  Users,
  Megaphone,
  Palette,
  Heart,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export default function Dashboard() {
  const { userProfile } = useAuth()
  const { data: products, loading: productsLoading } = useCollection('products')
  const { data: tasks, loading: tasksLoading } = useCollection('tasks')
  const { data: contacts, loading: contactsLoading } = useCollection('contacts')
  const { data: campaigns, loading: campaignsLoading } = useCollection('campaigns')
  const { data: artists, loading: artistsLoading } = useCollection('artists')
  const { data: emotions, loading: emotionsLoading } = useCollection('emotions')

  const loading =
    productsLoading ||
    tasksLoading ||
    contactsLoading ||
    campaignsLoading ||
    artistsLoading ||
    emotionsLoading

  // Calculate stats
  const stats = [
    {
      name: 'Products',
      value: products.length,
      inStock: products.filter((p) => p.status === 'In stock').length,
      icon: Package,
      href: '/products',
      color: 'bg-blue-500',
    },
    {
      name: 'Active Tasks',
      value: tasks.filter((t) => t.status !== 'Complete').length,
      total: tasks.length,
      icon: CheckSquare,
      href: '/tasks',
      color: 'bg-green-500',
    },
    {
      name: 'Contacts',
      value: contacts.length,
      icon: Users,
      href: '/contacts',
      color: 'bg-purple-500',
    },
    {
      name: 'Campaigns',
      value: campaigns.filter((c) => c.status === 'In progress').length,
      total: campaigns.length,
      icon: Megaphone,
      href: '/campaigns',
      color: 'bg-orange-500',
    },
    {
      name: 'Artists',
      value: artists.filter((a) => a.status !== 'Archived').length,
      icon: Palette,
      href: '/artists',
      color: 'bg-pink-500',
    },
    {
      name: 'Emotions/Desires',
      value: emotions.length,
      icon: Heart,
      href: '/emotions',
      color: 'bg-red-500',
    },
  ]

  // Get recent/urgent tasks
  const urgentTasks = tasks
    .filter((t) => t.status !== 'Complete' && t.urgency === 'B - Urgent')
    .slice(0, 5)

  // Get in-progress campaigns
  const activeCampaigns = campaigns
    .filter((c) => c.status === 'In progress')
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="page-title">
          Welcome back, {userProfile?.displayName?.split(' ')[0] || 'Friend'}!
        </h1>
        <p className="page-subtitle">
          Here's what's happening with My Living Hope today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} to={stat.href}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {loading ? '...' : stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <Card>
          <Card.Header className="flex items-center justify-between">
            <Card.Title>Urgent Tasks</Card.Title>
            <Link
              to="/tasks"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : urgentTasks.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No urgent tasks</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-dark-border">
                {urgentTasks.map((task) => (
                  <li
                    key={task.id}
                    className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-dark-surface-2 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {task.assignedTo?.join(', ') || 'Unassigned'}
                        </p>
                      </div>
                      <Badge status={task.status}>{task.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>

        {/* Active Campaigns */}
        <Card>
          <Card.Header className="flex items-center justify-between">
            <Card.Title>Active Campaigns</Card.Title>
            <Link
              to="/campaigns"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : activeCampaigns.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Megaphone className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No active campaigns</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-dark-border">
                {activeCampaigns.map((campaign) => (
                  <li
                    key={campaign.id}
                    className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-dark-surface-2 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {campaign.content}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.type}</p>
                      </div>
                      <Badge status={campaign.status}>{campaign.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <Card.Header>
          <Card.Title>Quick Actions</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/tasks"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <CheckSquare className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Add Task</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <Package className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Add Product</span>
            </Link>
            <Link
              to="/contacts"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <Users className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">Add Contact</span>
            </Link>
            <Link
              to="/brainstorm"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">New Idea</span>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
