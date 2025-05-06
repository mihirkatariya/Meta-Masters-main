import Event from "../Models/Eventdata.js"
import User from "../Models/User.js";

export async function getEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id).populate("members.user", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event", error: error.message });
  };
}

// Middleware for permission check
export function checkPermission(allowedRoles) {
  return async (req, res, next) => {
    const event = await Event.findById(req.params.id).populate("members.user");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const member = event.members.find((m) => m.user._id.equals(req.user._id));
    if (!member || !allowedRoles.includes(member.role))
      return res.status(403).json({ message: "Access denied" });

    req.event = event;
    next();
  };
}

// Create event
export async function createEvent(req, res) {
  const { name, type, startDate, endDate, location } = req.body;

  try {
    const event = await Event.create({
      name,
      type,
      startDate,
      endDate,
      location,
      stats: {
        totalItems: 0,
        itemsPacked: 0,
        itemsPending: 0,
        itemsDelivered: 0,
      },
      checklist: [], // Initialize an empty checklist
      members: [{ user: req.user._id, role: "owner" }], // Add the creator as the owner
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error: error.message });
  }
}

// Get events where user is a member
export async function getEvents(req, res) {
  const events = await Event.find({ "members.user": req.user._id }).populate(
    "members.user",
    "email name"
  );
  res.json(events);
}

// Update event
export async function updateEvent(req, res) {
  Object.assign(req.event, req.body);
  await req.event.save();
  res.json(req.event);
}

// Delete event
export async function deleteEvent(req, res) {
  try {
    await req.event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: err.message });
  }
}

// Invite a member by email
export async function inviteMember(req, res) {
  const { email, role } = req.body;
  const event = req.event;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const existing = event.members.find((m) => m.user.equals(user._id));
  if (existing)
    return res.status(400).json({ message: "User already in event" });

  event.members.push({ user: user._id, role: role || "member" });
  await event.save();

  res.json({ message: `Invited ${email}`, event });
}

// Change a member's role (owner only)
export async function changeMemberRole(req, res) {
  const { userId, newRole } = req.body;
  const event = req.event;

  const member = event.members.find((m) => m.user.equals(userId));
  if (!member)
    return res.status(404).json({ message: "Member not found in event" });

  member.role = newRole;
  await event.save();

  res.json({ message: "Role updated", event });
}

export async function addChecklistItem(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Item name required" });

  const newItem = {
    name,
    addedBy: req.user._id
  };

  req.event.checklist.push(newItem);
  await req.event.save();

  res.json(newItem); // return only the newly added item
}


export const getChecklist = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("checklist")
      .populate("members.user");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const member = event.members.find(
      (m) => m.user._id.toString() === req.user._id.toString()
    );

    const role = member ? member.role : "viewer";

    // ✅ Checklist should be sent to ALL roles
    res.json({
      checklist: event.checklist || [],
      role,
    });
  } catch (error) {
    console.error("Failed to get checklist:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export async function updateChecklistItem(req, res) {
  const { itemId } = req.params;
  const { status } = req.body;

  const item = req.event.checklist.id(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.status = status;
  await req.event.save();

  res.json(item);
}



export async function deleteChecklistItem(req, res) {
  const { itemId } = req.params;

  try {
    const event = req.event;
    const item = event.checklist.id(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    item.deleteOne(); // or event.checklist.pull(itemId)
    await event.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting checklist item:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

