import mongoose, { Schema } from 'mongoose';
import IUpdateHistoryModel from './Interface/IUpdateHistoryModel';
import { DB_NAMES } from '../../utils/enums';

const schema = new Schema({
  folder_id: {
    type: String,
    trim: true,
    required: true,
  },
  updated_at: {
    type: String,
    trim: true,
    required: true,
  },
});

export default mongoose.model<IUpdateHistoryModel>('UpdateHistory', schema, DB_NAMES.UPDATE_HISTORY.toString());
