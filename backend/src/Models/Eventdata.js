import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
  totalItems: { type: Number, default: 0 },
  itemsPacked: { type: Number, default: 0 },
  itemsPending: { type: Number, default: 0 },
  itemsDelivered: { type: Number, default: 0 },
}, { _id: false });

const MemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'member' }
}, { _id: false });

const ChecklistItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'packed', 'delivered'], default: 'pending' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  location: { type: String },
  stats: StatsSchema,
  members: [MemberSchema],
  checklist: [ChecklistItemSchema]
}, { timestamps: true });

export default mongoose.model('Event', EventSchema);
