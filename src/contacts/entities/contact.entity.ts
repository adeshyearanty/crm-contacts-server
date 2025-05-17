import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ index: true })
  company: string;

  @Prop({ index: true })
  jobTitle: string;

  @Prop({ index: true })
  tags: string[];

  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  })
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  @Prop({
    type: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
  })
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };

  @Prop()
  notes: string;

  @Prop({
    type: String,
    enum: ['active', 'inactive', 'lead', 'customer', 'prospect'],
    default: 'lead',
    index: true,
  })
  status: string;

  @Prop()
  source: string;

  @Prop({ index: true })
  lastContactedDate: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

// Create compound indexes for better search performance
ContactSchema.index({ firstName: 1, lastName: 1 });
ContactSchema.index({ 'address.city': 1, 'address.state': 1, 'address.country': 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ company: 1, jobTitle: 1 });
