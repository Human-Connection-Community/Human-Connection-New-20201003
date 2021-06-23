import { v4 as uuid } from 'uuid'

export default {
  id: { type: 'string', primary: true, default: uuid },
  showDonations: { type: 'boolean', required: true },
  goal: { type: 'number', required: true },
  progress: { type: 'number', required: true },
  createdAt: {
    type: 'string',
    isoDate: true,
    required: true,
    default: () => new Date().toISOString(),
  },
  updatedAt: {
    type: 'string',
    isoDate: true,
    required: true,
    default: () => new Date().toISOString(),
  },
}
