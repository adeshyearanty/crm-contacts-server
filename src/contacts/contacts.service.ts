/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContactsRepository } from './repositories/contacts.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsQueryDto } from './dto/contacts-query.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const contactData = {
        ...createContactDto,
        lastContactedDate: createContactDto.lastContactedDate
          ? new Date(createContactDto.lastContactedDate)
          : undefined,
      };
      return await this.contactsRepository.create(contactData);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(query: ContactsQueryDto) {
    return this.contactsRepository.findAllWithFilters(query);
  }

  async findOne(id: string) {
    const contact = await this.contactsRepository.findById(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    try {
      const contact = await this.contactsRepository.update(
        { _id: id },
        updateContactDto,
      );
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }
      return contact;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    const contact = await this.contactsRepository.delete({ _id: id });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }
}
