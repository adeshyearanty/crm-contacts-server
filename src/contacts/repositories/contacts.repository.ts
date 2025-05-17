/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../core/repositories/base.repository';
import { ContactsQueryDto } from '../dto/contacts-query.dto';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactsRepository extends BaseRepository<Contact> {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<Contact>,
  ) {
    super(contactModel);
  }

  async findAllWithFilters(query: ContactsQueryDto) {
    const {
      query: searchQuery,
      status,
      tags,
      company,
      jobTitle,
      city,
      state,
      country,
      createdAfter,
      createdBefore,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const filter: Record<string, any> = {};

    // Text search across multiple fields
    if (searchQuery) {
      filter.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { company: { $regex: searchQuery, $options: 'i' } },
        { jobTitle: { $regex: searchQuery, $options: 'i' } },
        { notes: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Company filter
    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }

    // Job title filter
    if (jobTitle) {
      filter.jobTitle = { $regex: jobTitle, $options: 'i' };
    }

    // Location filters
    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }
    if (state) {
      filter['address.state'] = { $regex: state, $options: 'i' };
    }
    if (country) {
      filter['address.country'] = { $regex: country, $options: 'i' };
    }

    // Date range filters
    if (createdAfter || createdBefore) {
      filter.createdAt = {};
      if (createdAfter) filter.createdAt.$gte = new Date(createdAfter);
      if (createdBefore) filter.createdAt.$lte = new Date(createdBefore);
    }

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      this.contactModel
        .find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.contactModel.countDocuments(filter),
    ]);

    return {
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + contacts.length < total,
      },
    };
  }
}
