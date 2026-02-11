import {
  Schema,
  model,
  models,
  Document,
  CallbackWithoutResult,
} from "mongoose";
import Event from "./event.model";

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Schema.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string): boolean {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  },
);

// Pre-save hook to verify eventId exists
BookingSchema.pre("save", async function (this: IBooking) {
  const eventExists = await Event.findById(this.eventId);
  if (!eventExists) {
    throw new Error("Referenced event does not exist");
  }
});

// Index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
