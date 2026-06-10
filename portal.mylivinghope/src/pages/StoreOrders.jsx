import { useState } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useAuth } from '../hooks/useAuth'
import { Card, Button, Table, Badge, Modal, Input, Select } from '../components/ui'
import { Textarea } from '../components/ui/Input'
import { centsToDollars, formatDate } from '../lib/utils'
import { PackageCheck, Search, Truck, Copy, Check } from 'lucide-react'

const STATUS_VARIANTS = {
  paid: 'info',
  fulfilled: 'warning',
  shipped: 'success',
  cancelled: 'default',
  refunded: 'danger',
}

const FILTER_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

const CARRIER_OPTIONS = [
  { value: 'NZ Post', label: 'NZ Post' },
  { value: 'CourierPost', label: 'CourierPost' },
  { value: 'Aramex', label: 'Aramex' },
  { value: 'Other', label: 'Other' },
]

const OVERRIDE_OPTIONS = [
  { value: '', label: 'Change status…' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'paid', label: 'Paid' },
]

function StatusBadge({ status }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] || 'default'}>{status}</Badge>
  )
}

function CopyableId({ label, value }) {
  const [copied, setCopied] = useState(false)
  if (!value) return null
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 max-w-full"
      title={`Copy ${label}`}
    >
      {copied ? <Check className="w-3 h-3 flex-shrink-0 text-green-600" /> : <Copy className="w-3 h-3 flex-shrink-0" />}
      <span className="truncate">{label}: {value}</span>
    </button>
  )
}

export default function StoreOrders() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('NZ Post')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [overrideStatus, setOverrideStatus] = useState('')
  const [confirmOverride, setConfirmOverride] = useState(false)

  const { data: orders, loading, update } = useCollection('orders', {
    orderByField: 'createdAt',
    orderDirection: 'desc',
  })
  const { isEditor } = useAuth()

  // Keep the modal's order in sync with live collection updates
  const order = selectedOrder ? orders.find((o) => o.id === selectedOrder.id) || selectedOrder : null

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q)
    const matchesStatus = !filterStatus || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  function openOrder(o) {
    setSelectedOrder(o)
    setTrackingNumber(o.fulfillment?.trackingNumber || '')
    setCarrier(o.fulfillment?.carrier || 'NZ Post')
    setNotes(o.notes || '')
    setOverrideStatus('')
    setConfirmOverride(false)
  }

  function closeOrder() {
    setSelectedOrder(null)
  }

  async function saveUpdate(fields) {
    setSaving(true)
    try {
      await update(order.id, { ...fields, updatedAt: new Date() })
    } finally {
      setSaving(false)
    }
  }

  const itemsSummary = (o) =>
    (o.items || []).map((it) => `${it.qty}× ${it.title}`).join(', ')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {orders.length} order{orders.length === 1 ? '' : 's'} · checkout via Stripe
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, name, or email..."
              className="pl-9"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={FILTER_STATUS_OPTIONS}
            className="sm:w-48"
          />
        </Card.Body>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>Order</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Tracking</Table.HeaderCell>
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Loading columns={7} />
            ) : filteredOrders.length === 0 ? (
              <Table.Empty
                icon={PackageCheck}
                title="No orders found"
                description={
                  search || filterStatus
                    ? 'Try adjusting your filters'
                    : 'Orders appear here automatically when customers pay'
                }
              />
            ) : (
              filteredOrders.map((o) => (
                <Table.Row
                  key={o.id}
                  onClick={() => openOrder(o)}
                  className="cursor-pointer"
                >
                  <Table.Cell>
                    <span className="font-medium">{o.orderNumber}</span>
                  </Table.Cell>
                  <Table.Cell>{o.createdAt ? formatDate(o.createdAt) : '-'}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{o.customer?.name || '-'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{o.customer?.email}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm truncate max-w-[200px] inline-block">{itemsSummary(o)}</span>
                  </Table.Cell>
                  <Table.Cell>${centsToDollars(o.totalNZD)}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={o.status} />
                  </Table.Cell>
                  <Table.Cell>
                    {o.fulfillment?.trackingNumber ? (
                      <span className="text-sm font-mono">{o.fulfillment.trackingNumber}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!order}
        onClose={closeOrder}
        title={order ? `Order ${order.orderNumber}` : ''}
        size="lg"
      >
        {order && (
          <div className="space-y-6">
            {/* Status + date */}
            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Placed {order.createdAt ? formatDate(order.createdAt) : '-'}
              </p>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Items</h3>
              <div className="border border-gray-200 dark:border-dark-surface-2 rounded-lg divide-y divide-gray-200 dark:divide-dark-surface-2">
                {(order.items || []).map((it, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="font-medium">{it.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {it.qty} × ${centsToDollars(it.unitPriceNZD)}
                      </p>
                    </div>
                    <p className="font-medium">${centsToDollars(it.qty * it.unitPriceNZD)}</p>
                  </div>
                ))}
                <div className="px-4 py-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${centsToDollars(order.subtotalNZD)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>${centsToDollars(order.shippingNZD)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-1">
                    <span>Total</span>
                    <span>${centsToDollars(order.totalNZD)} NZD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer + shipping */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Customer</h3>
                <p className="font-medium">{order.customer?.name || '-'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer?.email}</p>
                {order.customer?.phone && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer.phone}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Ship to</h3>
                <p className="text-sm">
                  {[order.shippingAddress?.line1, order.shippingAddress?.line2, order.shippingAddress?.city, order.shippingAddress?.region, order.shippingAddress?.postalCode, order.shippingAddress?.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>

            {/* Fulfillment */}
            {isEditor && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Fulfillment</h3>
                {order.status === 'shipped' && order.fulfillment?.trackingNumber ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span>
                      Shipped via {order.fulfillment.carrier} — <span className="font-mono">{order.fulfillment.trackingNumber}</span>
                      {order.fulfillment.shippedAt && ` on ${formatDate(order.fulfillment.shippedAt)}`}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {order.status === 'paid' && (
                      <Button
                        size="sm"
                        disabled={saving}
                        onClick={() => saveUpdate({ status: 'fulfilled' })}
                      >
                        <PackageCheck className="w-4 h-4" />
                        Mark Fulfilled
                      </Button>
                    )}
                    {(order.status === 'paid' || order.status === 'fulfilled') && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                        <Select
                          label="Carrier"
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          options={CARRIER_OPTIONS}
                          className="sm:w-40"
                        />
                        <Input
                          label="Tracking number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g. LX123456789NZ"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          disabled={saving || !trackingNumber.trim()}
                          onClick={() =>
                            saveUpdate({
                              status: 'shipped',
                              fulfillment: {
                                trackingNumber: trackingNumber.trim(),
                                carrier,
                                shippedAt: new Date(),
                              },
                            })
                          }
                        >
                          <Truck className="w-4 h-4" />
                          Mark Shipped
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {isEditor && (
              <div>
                <Textarea
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this order..."
                  rows={2}
                />
                {notes !== (order.notes || '') && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2"
                    disabled={saving}
                    onClick={() => saveUpdate({ notes })}
                  >
                    Save Notes
                  </Button>
                )}
              </div>
            )}

            {/* Stripe refs + status override */}
            <div className="pt-4 border-t border-gray-200 dark:border-dark-surface-2 space-y-2">
              <CopyableId label="Stripe session" value={order.stripeSessionId} />
              <CopyableId label="Payment intent" value={order.stripePaymentIntentId} />
              {isEditor && (
                <div className="flex items-center gap-2 pt-2">
                  <Select
                    value={overrideStatus}
                    onChange={(e) => {
                      setOverrideStatus(e.target.value)
                      setConfirmOverride(false)
                    }}
                    options={OVERRIDE_OPTIONS.filter((opt) => opt.value !== order.status)}
                    className="w-44"
                  />
                  {overrideStatus && !confirmOverride && (
                    <Button size="sm" variant="secondary" onClick={() => setConfirmOverride(true)}>
                      Set status
                    </Button>
                  )}
                  {overrideStatus && confirmOverride && (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={saving}
                      onClick={async () => {
                        await saveUpdate({ status: overrideStatus })
                        setOverrideStatus('')
                        setConfirmOverride(false)
                      }}
                    >
                      Confirm "{overrideStatus}"
                    </Button>
                  )}
                </div>
              )}
              {overrideStatus === 'refunded' && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This only records the status — process the actual refund in the Stripe dashboard.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
