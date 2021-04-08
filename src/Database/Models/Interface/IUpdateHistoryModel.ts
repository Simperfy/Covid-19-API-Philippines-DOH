/* eslint-disable semi */
/* eslint-disable no-extra-semi */
/* eslint-disable camelcase */
import { Document } from 'mongoose';

export default interface IUpdateHistoryModel extends Document {
  folder_id: string,
  updated_at: string,
}
